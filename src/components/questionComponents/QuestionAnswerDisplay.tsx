"use server";
import {
  AnswerDocument,
  CommentDocument,
  QuestionDocument,
  UserPrefs,
  VoteDocument,
} from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { storage } from "@/models/client/config";
import Image from "next/image";
import Markdown from "react-markdown";
import Comment from "../answerComponents/comment";
// import remarkGfm from "remark-gfm";
import VoteButtons from "../commonComponents/VoteButtons";
import {
  answerCollection,
  commentCollection,
  db,
  questionAttachmentBucket,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import getRelativeTime from "@/lib/convertDateToRelativeTime";
import { Query } from "node-appwrite";
import { MagicCard } from "../magicui/magic-card";
import Answers from "../answerComponents/renderAnswers";
import Link from "next/link";

export interface ModifiedCommentDocument extends CommentDocument {
  author: {
    $id: string;
    name: string;
    reputation: number;
  };
}

export interface ModifiedAnsDoc extends AnswerDocument {
  author: {
    $id: string;
    name: string;
    reputation: number;
  };
  upvotes: number;
  downvotes: number;
  comments: ModifiedCommentDocument[];
}

export default async function RenderQuestion({
  questionId,
  className,
}: {
  questionId: string;
  className?: string;
}) {
  const [questionData, answerData, upvotes, downvotes, comments] =
    await Promise.all([
      databases.getDocument<QuestionDocument>(
        db,
        questionCollection,
        questionId,
      ),
      databases.listDocuments<AnswerDocument>(db, answerCollection, [
        Query.orderAsc("$createdAt"),
        Query.equal("questionId", questionId),
      ]),
      databases.listDocuments<VoteDocument>(db, voteCollection, [
        Query.equal("typeId", questionId),
        Query.equal("type", "question"), //i think this should work without this as well
        Query.equal("voteStatus", "upvoted"),
        Query.limit(1),
      ]),
      databases.listDocuments<VoteDocument>(db, voteCollection, [
        Query.equal("typeId", questionId),
        Query.equal("type", "question"), //i think this should work without this as well
        Query.equal("voteStatus", "downvoted"),
        Query.limit(1),
      ]),
      databases.listDocuments<CommentDocument>(db, commentCollection, [
        Query.equal("typeId", questionId),
        Query.equal("type", "question"),
        Query.orderAsc("$createdAt"),
      ]),
    ]);
  const questionAuthor: string = (
    await users.get<UserPrefs>(questionData.authorId)
  ).name;
  //now i need the author and details of author of each comment and answer
  const modifiedComments: ModifiedCommentDocument[] = await Promise.all(
    comments.documents.map(async (value) => {
      const author = await users.get<UserPrefs>(value.authorId);
      return {
        ...value,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation,
        },
      };
    }),
  );
  // const modifiedAnswers: ModifiedAnsDoc[] = await Promise.all(
  //   answerData.documents.map(async (value) => {
  //     const [author, upvotes, downvotes, answerComments] = await Promise.all([
  //       users.get<UserPrefs>(value.authorId),
  //       databases.listDocuments<VoteDocument>(db, voteCollection, [
  //         Query.equal("typeId", value.$id),
  //         Query.equal("type", "question"), // probably should be "answer"
  //         Query.equal("voteStatus", "upvoted"),
  //         Query.limit(1),
  //       ]),
  //       databases.listDocuments<VoteDocument>(db, voteCollection, [
  //         Query.equal("typeId", value.$id),
  //         Query.equal("type", "question"), // probably should be "answer"
  //         Query.equal("voteStatus", "downvoted"),
  //         Query.limit(1),
  //       ]),
  //       databases.listDocuments<CommentDocument>(db, commentCollection, [
  //         Query.equal("typeId", value.$id),
  //         Query.equal("type", "answer"),
  //         Query.orderAsc("$createdAt"),
  //       ]),
  //     ]);

  //     const modifiedAnswerComments: ModifiedCommentDocument[] =
  //       await Promise.all(
  //         answerComments.documents.map(async (comment) => {
  //           const commentAuthor = await users.get<UserPrefs>(comment.authorId);
  //           return {
  //             ...comment,
  //             author: {
  //               $id: commentAuthor.$id,
  //               name: commentAuthor.name,
  //               reputation: commentAuthor.prefs.reputation,
  //             },
  //           };
  //         })
  //       );

  //     return {
  //       ...value,
  //       author: {
  //         $id: author.$id,
  //         name: author.name,
  //         reputation: author.prefs.reputation,
  //       },
  //       upvotes: upvotes.total,
  //       downvotes: downvotes.total,
  //       comments: modifiedAnswerComments,
  //     };
  //   })
  // );

  //GPT SOLUTION IDK WHY ABOVE CODE FAILS. BUT IF WRAPPING EVERYTHING INSIDE TRYCATCH IT WORKS
  const modifiedAnswersRaw: (ModifiedAnsDoc | null)[] = await Promise.all(
    answerData.documents.map(async (value) => {
      let author, upvotes, downvotes, answerComments;

      try {
        author = await users.get<UserPrefs>(value.authorId);
      } catch (err) {
        console.error(`Failed to fetch author :`, err);
        return null;
      }

      try {
        upvotes = await databases.listDocuments<VoteDocument>(
          db,
          voteCollection,
          [
            Query.equal("typeId", value.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1),
          ],
        );
      } catch (err) {
        console.error(`Failed to fetch upvotes:`, err);
        upvotes = { total: 0, documents: [] };
      }

      try {
        downvotes = await databases.listDocuments<VoteDocument>(
          db,
          voteCollection,
          [
            Query.equal("typeId", value.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1),
          ],
        );
      } catch (err) {
        console.error(
          `Failed to fetch downvotes`,
          err,
        );
        downvotes = { total: 0, documents: [] };
      }

      try {
        answerComments = await databases.listDocuments<CommentDocument>(
          db,
          commentCollection,
          [
            Query.equal("typeId", value.$id),
            Query.equal("type", "answer"),
            Query.orderAsc("$createdAt"),
          ],
        );
      } catch (err) {
        console.error(`Failed to fetch comments:`, err);
        answerComments = { documents: [] };
      }

      let modifiedAnswerComments: ModifiedCommentDocument[] = [];
      try {
        modifiedAnswerComments = await Promise.all(
          answerComments.documents.map(async (comment) => {
            try {
              const commentAuthor = await users.get<UserPrefs>(
                comment.authorId,
              );
              return {
                ...comment,
                author: {
                  $id: commentAuthor.$id,
                  name: commentAuthor.name,
                  reputation: commentAuthor.prefs.reputation,
                },
              };
            } catch (err) {
              console.error(
                `Failed to fetch author:`,
                err,
              );
              return {
                ...comment,
                author: {
                  $id: "unknown",
                  name: "Unknown User",
                  reputation: 0,
                },
              };
            }
          }),
        );
      } catch (err) {
        console.error(
          `Failed to process :`,
          err,
        );
      }

      return {
        ...value,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation,
        },
        upvotes: upvotes.total ?? upvotes.documents.length,
        downvotes: downvotes.total ?? downvotes.documents.length,
        comments: modifiedAnswerComments,
      };
    }),
  );

  // ✅ Filter out nulls and assign to the correctly typed variable
  const modifiedAnswers: ModifiedAnsDoc[] = modifiedAnswersRaw.filter(
    (ans): ans is ModifiedAnsDoc => ans !== null,
  );

  return (
    <div className={`${className} max-w-6/12`}>
      <MagicCard
        gradientColor="#1e2939"
        className="bg-gray-900 border-2 rounded-2xl"
        gradientOpacity={0.9}
        gradientSize={200}
        gradientFrom="black"
        gradientTo="white"
      >
        <Card className="border-0 m-1 bg-transparent">
          <CardHeader>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-4xl">{questionData.title}</CardTitle>
              <CardDescription className="flex flex-col gap-2 sm:flex-row">
                {Array.from(questionData.tags).map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="text-sm backdrop-blur-2xl bg-white/10 px-2 border-white/20 border-2 flex flex-row gap-2 justify-center items-center "
                    >
                      #{value}
                    </div>
                  );
                })}
              </CardDescription>
              <CardDescription>
                Posted by:{" "}
                <Link
                  href={`/users/${questionData.authorId}/${questionAuthor}`}
                >
                  <span className="font-bold text-md">{questionAuthor}</span>
                </Link>
              </CardDescription>
              <CardDescription className="text-sm font-light">
                Post Created :{" "}
                {getRelativeTime(new Date(questionData.$createdAt))}
              </CardDescription>
            </div>
            {/* <CardAction>
            {questionData.attachmentId ? (
              <Image
                className="object-cover"
                width={96}
                height={96}
                src={storage.getFileView(
                  questionAttachmentBucket,
                  questionData.attachmentId
                )}
                alt="Uploaded Image"
              />
            ) : null}
          </CardAction> */}
          </CardHeader>
          <CardContent className="prose prose-invert m-3 p-2 border-white/20 border-2 text-white text-justify max-w-none rounded-2xl backdrop-blur-2xl bg-black/10 ">
            <Markdown>{questionData.content}</Markdown>
          </CardContent>
          {questionData.attachmentId && (
            <CardContent className="flex justify-center p-1">
              <Image
                className="object-cover prose prose-invert m-3 p-1 border-white/20 border-2 text-white rounded-2xl backdrop-blur-2xl bg-black/10 flex justify-center items-center"
                width={400}
                height={400}
                src={storage.getFileView(
                  questionAttachmentBucket,
                  questionData.attachmentId,
                )}
                alt="Uploaded Image"
              />
            </CardContent>
          )}
          <CardFooter className="mt-4">
            <VoteButtons
              type={"question"}
              id={questionData.$id}
              upvotes={upvotes.total}
              downvotes={downvotes.total}
              className={""}
            />
            {/* implement vote mechanism later */}
          </CardFooter>
          <Comment
            className="max-w-none"
            comments={modifiedComments}
            type="question"
            typeId={questionId}
          />
        </Card>
      </MagicCard>
      <div className="m-3">
        <h1 className="text-4xl font-bold m-3">Answers</h1>
        <div className="flex flex-col gap-3">
          <Answers
            ProfilePage={false}
            AnswerList={modifiedAnswers}
            QuestionId={questionId}
          />
        </div>
      </div>
    </div>
  );
}
