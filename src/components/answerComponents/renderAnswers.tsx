"use client";

import { useAuthStore } from "@/store/Auth";
import {
  ModifiedAnsDoc,
  ModifiedCommentDocument,
} from "../questionComponents/QuestionAnswerDisplay";
import AnswerCard from "./answerCard";
import { useState } from "react";
import { databases } from "@/models/client/config";
import { answerCollection, db } from "@/models/name";
import { ID } from "appwrite";
import toast from "react-hot-toast";
import { AnswerDocument } from "@/types/types";
import { ShimmerButton } from "../magicui/shimmer-button";
import MDEditor from "@uiw/react-md-editor";

export default function Answers({
  AnswerList,
  ProfilePage,
  QuestionId,
  className,
}: {
  AnswerList: ModifiedAnsDoc[];
  ProfilePage: boolean;
  QuestionId?: string;
  className?: string;
}) {
  const { user } = useAuthStore();
  const [answersHere, setAnswersHere] = useState(AnswerList);
  const [formData, setFormData] = useState({
    content: "",
  });
  const onSubmit = async () => {
    try {
      if (!user) {
        toast.error("Please login first");
        return;
      }
      if (!formData.content) {
        toast.error("Please fill out all fields");
        return;
      }
      const response = await databases.createDocument<AnswerDocument>(
        db,
        answerCollection,
        ID.unique(),
        {
          authorId: user.$id,
          content: formData.content,
          questionId: QuestionId,
          karma: 0,
        },
      );
      const toAdd = {
        ...response,
        author: {
          $id: user.$id,
          name: user.name,
          reputation: user.prefs.reputation,
        },
        upvotes: 0,
        downvotes: 0,
        comments: [] as ModifiedCommentDocument[],
      };
      setAnswersHere((prev) => [...prev, toAdd]);
      setFormData({
        ...formData,
        content: "",
      });
      toast.success("Answer uploaded successfully!");
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`items-center space-y-8`}>
      {user && !ProfilePage && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Add Your Answer
            </h2>
            <ShimmerButton
              shimmerColor="#00f6ff"
              shimmerSize="0.2em"
              shimmerDuration="2.5s"
              background="#6d3596"
              onClick={() => onSubmit()}
              className="w-fit self-end lg:self-auto"
            >
              <span className="text-sm lg:text-base font-medium text-white">
                Publish Answer
              </span>
            </ShimmerButton>
          </div>
          <div className="min-h-[200px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus-within:ring-2 focus-within:ring-violet-400">
            <MDEditor
              value={formData.content}
              onChange={(value) =>
                setFormData({ ...formData, content: value ?? "" })
              }
            />
          </div>
        </div>
      )}
      <div className="">
        {answersHere.map((value) => (
          <AnswerCard
            className={`{${className}}`}
            AnswerDetails={value}
            ProfilePage={ProfilePage}
            key={value.$id}
          />
        ))}
      </div>
    </div>
  );
}
