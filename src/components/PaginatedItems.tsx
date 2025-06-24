"use client";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { QuestionDocument } from "@/types/types";
import QuestionCard from "./QuestionCard";
function Items({ currentItems }: { currentItems: QuestionDocument[] }) {
  return (
    <div>
      {currentItems.map((value, index) => {
        return <QuestionCard questionData={value} key={index} />;
      })}
    </div>
  );
}
export default function PaginatedItems({
  itemsPerPage,
  items,
}: {
  itemsPerPage: number;
  items: QuestionDocument[];
}) {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  //   const handlePageClick = (event) => {
  //     const newOffset = (event.selected * itemsPerPage) % items.length;
  //     console.log(
  //       `User requested page number ${event.selected}, which is offset ${newOffset}`
  //     );
  //     setItemOffset(newOffset);
  //   };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={(e) => {
          const newOffset = (e.selected * itemsPerPage) % items.length;
          console.log(
            `User requested page number ${e.selected}, which is offset ${newOffset}`
          );
          setItemOffset(newOffset);
        }}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
      />
    </>
  );
}
