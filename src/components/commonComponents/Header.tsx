"use client";
import { useAuthStore } from "@/store/Auth";
import { FloatingNav } from "@/components/ui/floating-navbar";
import slugify from "slugify";
export default function Header() {
  const user = useAuthStore().user;
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Questions",
      link: "/questions",
    },
  ];
  if (user) {
    navItems.push({
      name: "Profile",
      link: `/users/${user.$id}/${slugify(user.name)}`,
    });
  }
  return <FloatingNav navItems={navItems} className="dark:bg-gray-900" />;
}
