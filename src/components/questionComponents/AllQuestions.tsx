"use server";
import Link from "next/link";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { QuestionDocument } from "@/types/types";
import { Query } from "node-appwrite";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import QuestionCard from "./QuestionCard";
export default async function Questions({ page }: { page: number }) {
  const pageNumber: number = page;
  const questionPerPage = 4;
  const offset = pageNumber * questionPerPage;
  const response = await databases.listDocuments<QuestionDocument>(
    db,
    questionCollection,
    [Query.offset(offset), Query.limit(questionPerPage + 1)],
  );
  const questions =
    response.documents.length > questionPerPage
      ? response.documents.slice(0, -1)
      : response.documents;
  const hasNextPage = response.documents.length > questionPerPage; //as i have queried for 5 elements, so if i get 5 elements, then next page must exist
  const hasPrevPage = page > 0;

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex flex-row justify-between">
        <div className="text-4xl font-bold">All Questions</div>
        <Link href={"/questions/ask"}>
          <ShimmerButton
            shimmerColor="#00f6ff"
            shimmerSize="0.2em"
            shimmerDuration="2.5s"
            background="#6d3596"
          >
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask A question
            </span>
          </ShimmerButton>
        </Link>
      </div>
      <div>
        <div>Search</div>
      </div>
      <div className="flex flex-col gap-3">
        {questions.map((value, index) => {
          return <QuestionCard key={index} questionData={value} />;
        })}
        {questions.length === 0 && (
          <div className="p-3 m-3 text-2xl text-center font-bold">
            Nothing to see here!
          </div>
        )}
      </div>
      <div>
        <Pagination className="p-2">
          <PaginationContent>
            {hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious href={`/questions?page=${page - 1}`} />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={`/questions?page=${page}`}>
                {page + 1}{" "}
              </PaginationLink>
            </PaginationItem>
            {hasNextPage && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {hasNextPage && (
              <PaginationItem>
                <PaginationNext href={`/questions?page=${page + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
