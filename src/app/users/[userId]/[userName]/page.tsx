"use server";

import { cn } from "@/lib/utils";
import { db, answerCollection, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { AnswerDocument, QuestionDocument } from "@/types/types";
import axios from "axios";
import { Query } from "node-appwrite";

export default async function ProfileSummary({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const answers = await databases.listDocuments<AnswerDocument>(
    db,
    answerCollection,
    [Query.equal("authorId", userId), Query.limit(1)],
  );
  const questions = await databases.listDocuments<QuestionDocument>(
    db,
    questionCollection,
    [Query.equal("authorId", userId), Query.limit(1)],
  );
  const user: number = (
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUser`, {
      userId: userId,
    })
  ).data.user.karma;
  return (
    <div className="grid grid-cols-3 gap-3 items-stretch justify-around">
      <div className="h-full group/card">
        <div
          className={cn(
            " cursor-pointer overflow-hidden relative card  rounded-md shadow-xl  mx-auto backgroundImage flex flex-col justify-between p-4 bg-radial from-orange-500 via-orange-700 to-orange-900 text-center",
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              Karma
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 mt-4">
              This user has accumated
            </p>
            <p className="font-bold text-2xl text-center relative z-10">
              {user}
            </p>
            <p className="font-normal text-sm text-gray-50 relative z-10 ">
              karma over his lifetime.
            </p>
          </div>
        </div>
      </div>
      <div className="h-full group/card">
        <div
          className={cn(
            " cursor-pointer overflow-hidden relative card  rounded-md shadow-xl  mx-auto backgroundImage flex flex-col justify-between p-4 bg-radial from-sky-500 via-sky-700 to-sky-900 text-center",
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              Questions
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 mt-4">
              This user has asked
            </p>
            <p className="font-bold text-2xl text-center relative z-10">
              {questions.total}
            </p>
            <p className="font-normal text-sm text-gray-50 relative z-10">
              questions over his lifetime.
            </p>
          </div>
        </div>
      </div>
      <div className="h-full group/card">
        <div
          className={cn(
            " cursor-pointer overflow-hidden relative card  rounded-md shadow-xl  mx-auto backgroundImage flex flex-col justify-between p-4 bg-radial from-orange-500 via-orange-700 to-orange-900 text-center",
          )}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              Answers
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 mt-4">
              This user has answered
            </p>
            <p className="font-bold text-2xl text-center relative z-10">
              {answers.total}
            </p>
            <p className="font-normal text-sm text-gray-50 relative z-10">
              questons over his lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
