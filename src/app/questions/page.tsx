// "use client";
import Link from "next/link";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import QuestionCard from "@/components/QuestionCard";
import { QuestionDocument } from "@/types/types";
import PaginatedItems from "@/components/PaginatedItems"; 
export default async function Questions() {
  const response = await databases.listDocuments<QuestionDocument>(db, questionCollection);
  const question = response.documents;
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
      <div>
        {question.length} questions
      </div>
        {/* {
          question.map( (value, index) => {
            console.log(storage.getFileView(questionAttachmentBucket, value.attachmentId));
            return <QuestionCard key={index} questionData={value}/>
          } )
        } */}
        <PaginatedItems itemsPerPage={4} items={question}/>,
    </div>
    // <div className="container mx-auto px-4 pb-20 ">
    //     <div className="mb-10 flex items-center justify-between">
    //         <h1 className="text-3xl font-bold">All Questions</h1>
    //         <Link href="/questions/ask">
    //             <ShimmerButton className="shadow-2xl">
    //                 <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
    //                     Ask a question
    //                 </span>
    //             </ShimmerButton>
    //         </Link>
    //     </div>
    //     <div className="mb-4">
    //         {/* <Search /> */}
    //     </div>
    //     <div className="mb-4">
    //         {/* <p>{questions.total} questions</p> */}
    //     </div>
    //     <div className="mb-4 max-w-3xl space-y-6">
    //         {/* {questions.documents.map(ques => (
    //             <QuestionCard key={ques.$id} ques={ques} />
    //         ))} */}
    //     </div>
    //     {/* <Pagination total={questions.total} limit={25} /> */}
    // </div>
  );
}
