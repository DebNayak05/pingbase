"use server";

import QuestionCard from "@/components/questionComponents/QuestionCard";
import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { QuestionDocument } from "@/types/types";
import { Query } from "node-appwrite";

export default async function ProfileQuestions({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const questions = await databases.listDocuments<QuestionDocument>(
    db,
    questionCollection,
    [Query.equal("authorId", userId)],
  );

  return (
    <div className="flex flex-col gap-3 items-center">
      {questions.documents.map((value, index) => {
        return (
          <QuestionCard className="w-full" key={index} questionData={value} />
        );
      })}
      {questions.total === 0 && (
        <div className="p-3 m-3 text-2xl text-center font-bold">
          Nothing to see here!
        </div>
      )}
    </div>
  );
}
