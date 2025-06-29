"use client"
import { useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";
interface VoteStatus {
  status: "upvoted" | "downvoted" | "none";
}

interface VoteButtonProps {
    type: "question"|"answer",
    typeId:string,
    votedById:string, 
    voteStatus : "upvoted"
}
export default function VoteButtons () {
    const [voteStatus, setVoteStatus] = useState<VoteStatus>({status : "none"});
    const [karma, setKarma] = useState<number>(0);
    return (
        <div>
            <div>

            </div>
            <BiUpvote />
            <BiSolidUpvote/>
            <BiDownvote/>
            <BiSolidDownvote/>
        </div>
    )
}