import { Models } from "node-appwrite";
export interface VoteDocument extends Models.Document {
  typeId: string;
  voteStatus: "upvoted" | "downvoted";
  votedById: string;
  type: "question" | "answer";
}
export interface AnswerDocument extends Models.Document {
    content : string,
    authorId : string, 
    questionId : string, 
    karma : Number
}
export interface QuestionDocument extends Models.Document {
    title : string,
    tags : string, 
    content : string, 
    authorId : string,
    attachmentId : string,
    karma : Number
}
export interface UserPrefs {
  reputation: number;
}