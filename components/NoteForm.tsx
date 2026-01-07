"use client";

import { createNote } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PlusCircle, FileText, AlignLeft } from "lucide-react";

export default function NoteForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setTitle("");
      setContent("");
      onAdd();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    mutation.mutate({ title, content });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl h-fit sticky top-8">
      <div className="relative mb-4">
        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" size={20} />
        <input
          className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 text-gray-800 px-4 pl-12 py-3 text-lg font-semibold rounded-2xl outline-none transition-all focus:bg-white focus:shadow-md"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="relative mb-6">
        <AlignLeft className="absolute left-4 top-5 text-indigo-500 pointer-events-none" size={20} />
        <textarea
          className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-500 text-gray-800 px-4 pl-12 py-3 text-base rounded-2xl outline-none resize-none transition-all focus:bg-white focus:shadow-md"
          placeholder="Note content..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      <button
        className="w-full text-white font-semibold px-6 py-3 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        style={{ backgroundColor: 'rgb(10 25 47 / 1)' }}
        type="submit"
        disabled={mutation.isPending}
      >
        <PlusCircle size={20} />
        {mutation.isPending ? "Adding..." : "Add Note"}
      </button>
    </form>
  );
}