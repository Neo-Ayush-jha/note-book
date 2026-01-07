"use client";
import { useState, useEffect } from "react";
import NoteForm from "@/components/NoteForm";
import NoteList from "@/components/NoteList";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");
  const fullText = "My Notes Book";

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

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white text-center font-bold mb-8 tracking-wide">
          {typedTitle}
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <NoteForm onAdd={() => setRefresh((r) => r + 1)} />
          </div>
          <div className="w-full lg:flex-1">
            <NoteList refresh={refresh} />
          </div>
        </div>
      </div>
    </main>
  );
}
