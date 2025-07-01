"use client";

import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { CommentDocument } from "@/types/types";
import { ID } from "appwrite";
import { useState } from "react";
import { ModifiedCommentDocument } from "../questionComponents/QuestionAnswerDisplay";
import Link from "next/link";

export default function Comment({
  comments,
  type,
  typeId,
  className,
}: {
  comments: ModifiedCommentDocument[];
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) {
  const [commentsHere, setCommentsHere] = useState(comments);
  const [newComment, setNewComment] = useState("");

  const { user } = useAuthStore();
  const handleSubmit = async () => {
    try {
      if (!user || !newComment) {
        return;
      }
      const response = await databases.createDocument<CommentDocument>(
        db,
        commentCollection,
        ID.unique(),
        {
          authorId: user.$id,
          content: newComment,
          type: type,
          typeId: typeId,
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
      };
      setCommentsHere((prev) => [...prev, toAdd]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={`${className} flex flex-col gap-3 mt-4`}>
      <div className="flex flex-col gap-2">
        {commentsHere.map((comment, index) => (
          <div
            key={index}
            className="rounded-xl px-4 py-2 mx-3 text-sm text-white border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Link href={`/users/${comment.authorId}/${comment.author.name}`}>
              <span className="text-xs text-white/50 mb-1">
                {comment.author.name}
              </span>
            </Link>
            <div className="whitespace-pre-line">{comment.content}</div>
          </div>
        ))}
      </div>

      {/* Add New Comment */}
      {user && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="rounded-xl px-4 mx-3 py-2 text-white bg-black/30 border border-white/10 backdrop-blur-md placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="mx-3 self-end bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
