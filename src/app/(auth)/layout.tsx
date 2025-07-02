"use client";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useAuthStore().session;
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/questions");
    }
  }, [session]);

  if (session) {
    return null;
  }

  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
