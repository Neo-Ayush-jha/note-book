"use client";

import { useState, useEffect } from "react";
import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function DashboardPage() {
  const [refresh, setRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            My Notes Dashboard
          </h1>
          <p className="text-gray-400">Welcome back, {user.name}!</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-96 lg:shrink-0">
            <NoteForm onAdd={() => setRefresh((r) => r + 1)} />
          </div>
          <div className="w-full lg:flex-1">
            <NoteList refresh={refresh} searchQuery={searchQuery} />
          </div>
        </div>
      </div>
    </main>
  );
}
