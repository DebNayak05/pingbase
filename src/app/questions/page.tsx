import Questions from "@/components/questionComponents/AllQuestions";

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pageStr = resolvedParams?.page ?? "0";
  const page = isNaN(parseInt(pageStr)) ? 0 : parseInt(pageStr);

  return <Questions page={page} />;
}
