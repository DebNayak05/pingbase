"use client";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import Footer from "../components/Footer";
import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
export default function Func() {
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <div>
      <Header />
      {/* <MDEditor
        value={value}
        onChange={(value) => {
          if (!value) {
            setValue("");
          } else {
            setValue(value);
          }
        }}
      /> */}
      <Footer />
      <main>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger onClick={()=>{router.push("/")}}>File</MenubarTrigger>
            
          </MenubarMenu>
        </Menubar>
      </main>
    </div>
  );
}
