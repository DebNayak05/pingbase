"use client";
import { ShimmerButton } from "../magicui/shimmer-button";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import { databases, storage } from "@/models/client/config";
import { useAuthStore } from "@/store/Auth";
import { QuestionDocument } from "@/types/types";
import MDEditor from "@uiw/react-md-editor";
import { AppwriteException, ID } from "node-appwrite";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef } from "react";
export default function QuestionForm({
  question,
}: {
  question: QuestionDocument | null;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore();
  const [tag, setTag] = useState("");
  const [formData, setFormData] = useState({
    title: question ? question.title : "",
    content: question ? question.content : "",
    authorId: user?.$id,
    questionId: question ? question.$id : "",
    tags: new Set((question ? question.tags : []) as string[]),
    attachment: null as File | null,
  });
  useEffect(() => {
    if (user) {
      setFormData({ ...formData, authorId: user.$id });
    }
  }, [user]);
  const create = async () => {
    try {
      let storageResponse = null;
      if (formData.attachment) {
        storageResponse = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          formData.attachment
        );
      }
      const response = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title: formData.title,
          authorId: formData.authorId,
          tags: Array.from(formData.tags),
          attachmentId: storageResponse ? storageResponse.$id : null,
          content: formData.content,
          karma: 0,
        }
      );
      toast.success("Question uploaded successfully!");
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // const update = async () => {
  //   if (!question) {
  //     return "please provide previous question";
  //   }
  //   let storageResponse = null;
  //   if (formData.attachment) {
  //     if (question.attachmentId) {
  //       await storage.deleteFile(
  //         questionAttachmentBucket,
  //         question.attachmentId
  //       );
  //     }
  //     storageResponse = await storage.createFile(
  //       questionAttachmentBucket,
  //       ID.unique(),
  //       formData.attachment
  //     );
  //   }
  //   const response = await databases.updateDocument(
  //     db,
  //     questionCollection,
  //     ID.unique(),
  //     {
  //       title: formData.title,
  //       authorId: formData.authorId,
  //       tags: Array.from(formData.tags),
  //       attachmentId: storageResponse ? storageResponse.$id : null,
  //       content: formData.content,
  //     }
  //   );
  //   return response;
  // };

  const onSubmit = async () => {
    console.log(formData);
    if (
      !formData.title ||
      !formData.content ||
      !formData.authorId ||
      !formData.tags
    ) {
      toast.error("Please fill out all fields");
      return;
    }
    try {
      await create();
      setFormData({
        ...formData,
        title: "",
        content: "",
        questionId: "",
        tags: new Set([] as string[]),
        attachment: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      console.error(error);
    } 
  };
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex flex-row justify-between">
        <div className="text-4xl font-bold">Question Form</div>
        <ShimmerButton
          shimmerColor="#00f6ff"
          shimmerSize="0.2em"
          shimmerDuration="2.5s"
          background="#6d3596"
          onClick={() => onSubmit()}
        >
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Publish
          </span>
        </ShimmerButton>
      </div>
      <div>
        <Input
          type="text"
          value={formData.title}
          placeholder="Enter question title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <MDEditor
          value={formData.content}
          onChange={(value) => {
            if (!value) {
              setFormData({ ...formData, content: "" });
            } else {
              setFormData({ ...formData, content: value });
            }
          }}
        />
      </div>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          setFormData({ ...formData, attachment: e.target.files[0] });
        }}
      />
      <div className="flex flex-row gap-3">
        <Input value={tag} onChange={(e) => setTag(e.target.value)} />
        <Button
          onClick={() => {
            if (tag.length === 0) {
              return;
            }
            setFormData({
              ...formData,
              tags: new Set([...formData.tags, tag]),
            });
            setTag("");
          }}
        >
          Add tag
        </Button>
      </div>
      <div className="flex flex-row gap-3">
        {Array.from(formData.tags).map((value, index) => {
          return (
            <div
              key={index}
              className="backdrop-blur-2xl bg-white/10 py-1 px-3 border-white/20 border-2 flex flex-row gap-2 justify-center items-center "
            >
              {value}
              <button
                onClick={() => {
                  const newSet = Array.from(formData.tags).filter(
                    (item) => item !== value
                  );
                  setFormData({ ...formData, tags: new Set(newSet) });
                }}
                className="cursor-pointer text-white hover:scale-120 hover:text-red-600 transition-all transition-500"
              >
                <RxCross1 />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
