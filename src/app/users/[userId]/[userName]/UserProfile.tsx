"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetails } from "@/types/types";
import getRelativeTime from "@/lib/convertDateToRelativeTime";
import { useRouter } from "next/navigation";
export default function UserProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, userName } = useParams();
  const router = useRouter();
  const params = useParams<{ userId: string; userName: string }>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDetails>();
  const [selected, setSelected] = useState<string>("summary");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getUser", {
          userId: params.userId,
        });
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-3 items-center p-4">
      <Card className=" bg-gradient-to-bl from-gray-800 via-zinc-600 to-gray-800 border-blue-300 w-8/12">
        <CardHeader>
          <CardTitle className="text-5xl">
            {loading ? "Loading..." : user ? user.name : "server error"}
          </CardTitle>
          <CardDescription>
            {loading
              ? "Loading..."
              : user
                ? `Account created ${getRelativeTime(new Date(user.created))}`
                : "server error"}
          </CardDescription>
          <CardDescription>
            {loading
              ? "Loading..."
              : user
                ? `Last Activity ${getRelativeTime(new Date(user.lastOnline))}`
                : "server error"}
          </CardDescription>
          <CardAction>Edit Details</CardAction>
        </CardHeader>
        <CardContent>
          <p>
            {loading
              ? "Loading..."
              : user
                ? `Karma : ${user.karma}`
                : "server error"}
          </p>
        </CardContent>
        <CardFooter>
          <p>
            {loading
              ? "Loading..."
              : user
                ? `User Email ID : ${user.email}`
                : "server error"}
          </p>
        </CardFooter>
      </Card>
      <Menubar className=" border-blue-300 bg-gray-950 flex flex-row justify-around w-8/12">
        <MenubarMenu>
          <MenubarTrigger
            className={`${selected === "summary" ? "bg-accent" : ""}`}
            onClick={() => {
              setSelected("summary");
              router.push(`/users/${userId}/${userName}`);
            }}
          >
            Summary
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className={`${selected === "questions" ? "bg-accent" : ""}`}
            onClick={() => {
              setSelected("questions");
              router.push(`/users/${userId}/${userName}/questions`);
            }}
          >
            Questions
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger
            className={`${selected === "answers" ? "bg-accent" : ""}`}
            onClick={() => {
              setSelected("answers");
              router.push(`/users/${userId}/${userName}/answers`);
            }}
          >
            Answers
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="w-8/12">{children}</div>
    </div>
  );
}
