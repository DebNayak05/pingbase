"use client";
import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { VoteDocument } from "@/types/types";
import { Query } from "appwrite";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";

export default function VoteButtons({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: number;
  downvotes: number;
  className: string;
}) {
  const { user } = useAuthStore();
  const [votedDocument, setVotedDocument] = useState<VoteDocument | null>(null);
  const [voteResult, setVoteResult] = useState<number>(upvotes - downvotes);
  const [curVote, setCurVote] = useState<string>("none");
  const [disabled, setDisabled] = useState<boolean>(false);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return;
      }
      const response = await databases.listDocuments<VoteDocument>(
        db,
        voteCollection,
        [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ],
      );
      setVotedDocument(response.documents[0] || null);
      if (response.documents[0]) {
        setCurVote(response.documents[0].voteStatus);
      }
    };
    fetchUserData();
  }, [user]);
  const toggleUpvote = async () => {
    if (!user) {
      toast.error("Please Login first");
      return;
    }
    try {
      setDisabled(true);
      const response = await axios.post("/api/vote", {
        type: type,
        typeId: id,
        votedById: user.$id,
        voteStatus: "upvoted",
      });
      const updatedVote = response.data.voteResponse;
      const prevVote = votedDocument?.voteStatus || "none";
      setVotedDocument(updatedVote);
      setCurVote(updatedVote.voteStatus);
      if (!updatedVote) {
        throw new Error("Something went wrong");
      }
      setVotedDocument(updatedVote);
      setCurVote("upvoted");
      if (prevVote === "downvoted") {
        setVoteResult((prev) => prev + 2);
      } else if (!prevVote || prevVote === "none") {
        setVoteResult((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };
  const toggleDownvote = async () => {
    if (!user) {
      toast.error("Please Login first");
      return;
    }
    try {
      setDisabled(true);
      const response = await axios.post("/api/vote", {
        type: type,
        typeId: id,
        votedById: user.$id,
        voteStatus: "downvoted",
      });
      const updatedVote = response.data.voteResponse;
      const prevVote = votedDocument?.voteStatus || "none";
      setVotedDocument(updatedVote);
      setCurVote(updatedVote.voteStatus);
      if (!updatedVote) {
        throw new Error("Something went wrong");
      }
      setVotedDocument(updatedVote);
      setCurVote("downvoted");
      if (prevVote === "upvoted") {
        setVoteResult((prev) => prev - 2);
      } else if (!prevVote || prevVote === "none") {
        setVoteResult((prev) => prev - 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <div
      className={`${className} flex flex-row items-center text-xl gap-3  border-white border-2 p-3 rounded-3xl ${curVote === "none" ? "bg-gray-700" : curVote === "upvoted" ? "bg-orange-500" : "bg-violet-500"}`}
    >
      <button
        onClick={toggleUpvote}
        className="cursor-pointer disabled:cursor-not-allowed"
        disabled={curVote === "upvoted" || disabled}
      >
        {curVote === "upvoted" ? (
          <BiSolidUpvote className="text-white" />
        ) : (
          <BiUpvote />
        )}
      </button>
      <span className="text-sm font-semibold">{voteResult}</span>
      <button
        onClick={toggleDownvote}
        className="cursor-pointer disabled:cursor-not-allowed"
        disabled={curVote === "downvoted" || disabled}
      >
        {curVote === "downvoted" ? (
          <BiSolidDownvote className="text-white" />
        ) : (
          <BiDownvote />
        )}
      </button>
    </div>
  );
}
