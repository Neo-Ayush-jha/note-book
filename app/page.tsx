"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const [typedTitle, setTypedTitle] = useState("");
  const fullText = "Welcome to My Notes Book";
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedTitle(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className=" px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-bold mb-8 tracking-wide min-h-16">
            {typedTitle}
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            A secure, JWT-authenticated note-taking application built with
            Next.js, MongoDB, and TailwindCSS
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">🔐 Secure</h3>
              <p className="text-gray-300">
                JWT authentication with bcrypt password hashing
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">⚡ Fast</h3>
              <p className="text-gray-300">
                Built with Next.js and optimized for performance
              </p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                📱 Responsive
              </h3>
              <p className="text-gray-300">Works seamlessly on all devices</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t border-gray-800 px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Built using Next.js, MongoDB & JWT</p>
          <p className="text-sm mt-2">© 2026 NoteBook. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
