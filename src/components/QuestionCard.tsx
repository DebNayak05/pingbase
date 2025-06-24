import { QuestionDocument } from "@/types/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { storage } from "@/models/client/config";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { questionAttachmentBucket } from "@/models/name";
import Link from "next/link";

export default function QuestionCard({
  questionData,
}: {
  questionData: QuestionDocument;
}) {
  return (
    <Link href={"/"}>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl">{questionData.title}</CardTitle>

            <CardDescription className="flex flex-row gap-2">
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
          </div>
          <CardAction>
            {questionData.attachmentId ? (
              <img
                className="h-24 w-24 object-cover"
                src={storage.getFileView(
                  questionAttachmentBucket,
                  questionData.attachmentId
                )}
                alt="Uploaded Image"
              />
            ) : null}
          </CardAction>
        </CardHeader>
        <CardContent className="prose-sm [&_*]:text-sm prose-invert text-white text-justify max-h-56 line-clamp-8">
          <Markdown>{questionData.content}</Markdown>
        </CardContent>
        {/* <CardFooter className="mt-4"></CardFooter> */}
      </Card>
    </Link>
  );
}
