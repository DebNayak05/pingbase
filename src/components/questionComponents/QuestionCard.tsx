import { QuestionDocument } from "@/types/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { storage } from "@/models/client/config";
import Image from "next/image";
import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import { questionAttachmentBucket } from "@/models/name";
import Link from "next/link";
import { MagicCard } from "../magicui/magic-card";

export default function QuestionCard({
  questionData,
  className,
}: {
  questionData: QuestionDocument;
  className?: string;
}) {
  return (
    <Link href={`/questions/${questionData.$id}`} className={className}>
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
                <Image
                  className="object-cover"
                  width={96}
                  height={96}
                  src={storage.getFileView(
                    questionAttachmentBucket,
                    questionData.attachmentId,
                  )}
                  alt="Uploaded Image"
                />
              ) : null}
            </CardAction>
          </CardHeader>
          <CardContent className="prose-sm [&_*]:text-sm prose-invert text-white text-justify max-h-56 line-clamp-8 max-w-none">
            <Markdown>{questionData.content}</Markdown>
          </CardContent>
          {/* <CardFooter className="mt-4"></CardFooter> */}
        </Card>
      </MagicCard>
    </Link>
  );
}
