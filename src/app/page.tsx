import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white font-sans">
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
          Welcome to PingBase
        </h1>
        <p className="text-xl max-w-2xl mb-12 text-zinc-300">
          A modern, community-driven Q&A platform built for meaningful
          discussions and content discovery. Share questions, post answers, and
          engage through comments and voting.
        </p>
        <div className="flex gap-6">
          <Link href={"/login"}>
            <Button className="text-lg px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-800/40 transition-all duration-200 cursor-pointer">
              Login / Register
            </Button>
          </Link>
          <a
            href="https://github.com/DebNayak05/pingbase"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="cursor-pointer text-lg px-8 py-4 rounded-2xl border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-all duration-200"
            >
              <FaGithub className="mr-2" /> View on GitHub
            </Button>
          </a>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">About PingBase!</h2>
          <ul className="grid sm:grid-cols-2 gap-10 text-left text-zinc-300 text-lg">
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              {" "}
              Ask questions and receive insightful answers
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              {" "}
              Engage in discussions through comments
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              {" "}
              Vote on content to highlight quality contributions
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              {" "}
              Built with Next.js, Appwrite, and Tailwind CSS
            </li>
          </ul>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Explore Questions</h2>
          <p className="text-zinc-400 text-lg mb-8">
            Curious minds are waiting. Dive into the latest discussions, find
            answers, or ask your own.
          </p>
          <Link href="/questions">
            <Button className="text-lg px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 shadow-lg transition-all duration-200">
              Browse Questions
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
