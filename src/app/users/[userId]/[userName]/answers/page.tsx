"use server";
import {
  ModifiedAnsDoc,
  ModifiedCommentDocument,
} from "@/components/questionComponents/QuestionAnswerDisplay";
import { databases } from "@/models/client/config";
import { answerCollection, commentCollection, db } from "@/models/name";
import { users } from "@/models/server/config";
import { voteCollection } from "@/models/name";
import {
  AnswerDocument,
  UserPrefs,
  VoteDocument,
} from "@/types/types";
import { Query } from "node-appwrite";
import Answers from "@/components/answerComponents/renderAnswers";
export default async function ProfileAnswers({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const answers = await databases.listDocuments<AnswerDocument>(
    db,
    answerCollection,
    [Query.equal("authorId", userId)]
  );
  const author = await users.get<UserPrefs>(userId);
  const modifiedAnswers: ModifiedAnsDoc[] = await Promise.all(
    answers.documents.map(async (value, index) => {
      const [upvotes, downvotes] = await Promise.all([
        databases.listDocuments<VoteDocument>(db, voteCollection, [
          Query.equal("typeId", value.$id),
          Query.equal("type", "answer"), // probably should be "answer"
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),
        databases.listDocuments<VoteDocument>(db, voteCollection, [
          Query.equal("typeId", value.$id),
          Query.equal("type", "answer"), // probably should be "answer"
          Query.equal("voteStatus", "downvoted"),
          Query.limit(1),
        ]),
      ]);
      return {
        ...value,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation,
        },
        upvotes: upvotes.total,
        downvotes: downvotes.total,
        comments: [] as ModifiedCommentDocument[],
      };
    })
  );
  return <Answers className="min-w-5/12" ProfilePage={true} AnswerList={modifiedAnswers} />;
}
