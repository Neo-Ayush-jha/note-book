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
    <form onSubmit={handleSubmit} className="note-form">
      <div className="input-wrapper">
        <FileText className="input-icon" size={20} />
        <input
          className="note-input"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="input-wrapper flex-1">
        <AlignLeft className="input-icon" size={20} />
        <textarea
          className="note-textarea border border-1 border-gray-100"
          placeholder="Note content..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button
        className="note-btn"
        type="submit"
        disabled={mutation.isPending}
      >
        <PlusCircle size={18} />
        {mutation.isPending ? "Adding..." : "Add Note"}
      </button>
    </form>
  );
}