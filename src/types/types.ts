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
    karma : number
}
export interface QuestionDocument extends Models.Document {
    title : string,
    tags : string, 
    content : string, 
    authorId : string,
    attachmentId : string,
    karma : number
}
export interface UserPrefs {
  reputation: number;
}
export interface UserDetails {
  name : string,
  email : string,
  created : Date,
  lastOnline : Date,
  karma : number
}