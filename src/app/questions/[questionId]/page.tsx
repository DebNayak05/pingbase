"use server";
import RenderQuestion from "@/components/questionComponents/QuestionAnswerDisplay";
export default async function QuestionAnswerPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;
  console.log(questionId);
  return (
    <div className="flex flex-col gap-3 justify-center items-center max-w-full">
      <RenderQuestion className="p-3" questionId={questionId} />
    </div>
  );
}
