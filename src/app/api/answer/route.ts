import { handleApiErrors } from "@/lib/errors.server";
import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId,
      karma : 0
    });
    // const prefs = await users.getPrefs<UserPrefs>(authorId);
    // await users.updatePrefs(authorId, {
    //   reputation: Number(prefs.reputation) + 1,
    // });

    return NextResponse.json(
      {
        message: "Answer posted successfully!",
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return handleApiErrors(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();
    await databases.deleteDocument(db, answerCollection, answerId);
    return NextResponse.json(
      {
        message: "Answer deleted successfully!.",
        success: true,
      },
      {
        status: 200,
      },
    );
  } catch (error: unknown) {
    return handleApiErrors(error);
  }
}
