import { handleApiErrors } from "@/lib/errors.server";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";
import { Models } from "node-appwrite";
import { QuestionDocument, VoteDocument } from "@/types/types";
import { AnswerDocument } from "@/types/types";
import { UserPrefs } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const { type, typeId, votedById, voteStatus } = await request.json();
    const response = (await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ])) as Models.DocumentList<VoteDocument>;
    const isQuestion: boolean = type === "question";
    /**
         * Structure of a response object
         *  POST /api/vote 500 in 4661ms
            { total: 0, documents: [] }

            Full response object: {
            total: 1,
            documents: [
                {
                typeId: '2',
                voteStatus: 'downvoted',
                votedById: 'hello',
                type: 'answer',
                '$id': '68474657001b57fed1b6',
                '$createdAt': '2025-06-09T20:38:47.837+00:00',
                '$updatedAt': '2025-06-09T20:38:47.837+00:00',
                '$permissions': [],
                '$databaseId': 'pingbase',
                '$collectionId': 'votes'
                }
            ]
            }
         */

    if (response.total !== 0) {
      await databases.deleteDocument(
        db,
        voteCollection,
        response.documents[0].$id
      );
      const wasUpvotedBefore: boolean =
        response.documents[0].voteStatus === "upvoted";
      const questionOrAnswer = (await databases.getDocument(
        db,
        isQuestion ? questionCollection : answerCollection,
        typeId
      )) as AnswerDocument | QuestionDocument;
      await databases.updateDocument(
        db,
        isQuestion ? questionCollection : answerCollection,
        typeId,
        {
          karma: Number(questionOrAnswer.karma) + (wasUpvotedBefore ? -1 : 1),
        }
      );
      console.log("hello");
      const authorPrefs = await users.getPrefs<UserPrefs>(
        questionOrAnswer.authorId
      );
      console.log(authorPrefs);
      await users.updatePrefs(questionOrAnswer.authorId, {
        reputation:
          Number(authorPrefs.reputation) + (wasUpvotedBefore ? -1 : 1),
      });
    }
    const curQuestionOrAnswer = (await databases.getDocument(
      db,
      isQuestion ? questionCollection : answerCollection,
      typeId
    )) as AnswerDocument | QuestionDocument;
    const curUpvoted: boolean = voteStatus === "upvoted";
    await databases.updateDocument(
      db,
      isQuestion ? questionCollection : answerCollection,
      typeId,
      { karma: Number(curQuestionOrAnswer.karma) + (curUpvoted ? +1 : -1) }
    );
    const authorPrefs = await users.getPrefs<UserPrefs>(
      curQuestionOrAnswer.authorId
    );
    await users.updatePrefs(curQuestionOrAnswer.authorId, {
      reputation: Number(authorPrefs.reputation) + (curUpvoted ? +1 : -1),
    });
    await databases.createDocument(db, voteCollection, ID.unique(), {
      typeId: typeId,
      voteStatus: voteStatus,
      type: type,
      votedById: votedById,
    });
    return NextResponse.json(
      {
        message: `Post ${type === "upvoted" ? "upvoted" : "downvoted"} successfully`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiErrors(error);
  }
}
