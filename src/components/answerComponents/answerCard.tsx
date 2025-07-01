import getRelativeTime from "@/lib/convertDateToRelativeTime";
import { MagicCard } from "../magicui/magic-card";
import { ModifiedAnsDoc } from "../questionComponents/QuestionAnswerDisplay";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Markdown from "react-markdown";
import Link from "next/link";
import Comment from "./comment";
import VoteButtons from "../commonComponents/VoteButtons";

export default function AnswerCard({
  AnswerDetails,
  ProfilePage,
  className = "w-full", // Default width
}: {
  AnswerDetails: ModifiedAnsDoc;
  ProfilePage: boolean;
  className?: string;
}) {
  return (
    <div className={`${className} bg-gray-800`}>
      <MagicCard
        gradientColor="#1e2939"
        className="bg-gray-900 border-2 rounded-2xl"
        gradientOpacity={0.9}
        gradientSize={100}
        gradientFrom="black"
        gradientTo="white"
      >
        <Card className="border-0 m-1 bg-transparent rounded-2xl max-h-fit">
          <CardHeader>
            <Link
              href={`/users/${AnswerDetails.authorId}/${AnswerDetails.author.name}`}
            >
              <div className="flex flex-col gap-1">
                <CardTitle>{AnswerDetails.author.name}</CardTitle>
                <CardDescription className="text-sm font-light">
                  Posted: {getRelativeTime(new Date(AnswerDetails.$createdAt))}
                </CardDescription>
              </div>
            </Link>
            {ProfilePage && (
              <Link
                className="text-sm font-light"
                href={`/questions/${AnswerDetails.questionId}`}
              >
                <CardDescription className="text-blue-600 underline">
                  Question Link
                </CardDescription>
              </Link>
            )}
          </CardHeader>
          <CardContent className="prose prose-invert m-3 p-4 max-w-none border-white/20 border-2 text-white rounded-2xl backdrop-blur-2xl bg-black/10">
            <Markdown>{AnswerDetails.content}</Markdown>
          </CardContent>
          {!ProfilePage && (
            <VoteButtons
              type={"answer"}
              id={AnswerDetails.$id}
              upvotes={AnswerDetails.upvotes}
              downvotes={AnswerDetails.downvotes}
              className={"w-fit mx-3"}
            />
          )}
          {!ProfilePage && (
            <Comment
              comments={AnswerDetails.comments}
              type="answer"
              typeId={AnswerDetails.$id}
            />
          )}
        </Card>
      </MagicCard>
    </div>
  );
}
