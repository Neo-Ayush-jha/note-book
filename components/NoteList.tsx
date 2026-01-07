"use client";

import { deleteNote, fetchNotes } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Trash2, Calendar, StickyNote } from "lucide-react";

interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoteList({ refresh }: { refresh: number }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotesData() {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotesData();
  }, [refresh]);

  async function handleDelete(id: string) {
    await deleteNote(id);
    fetchNotesData();
  }

  if (loading) return <p style={{ color: "#f6eaea", textAlign: "center" }}>Loading notes...</p>;
  if (notes.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <StickyNote size={48} style={{ color: "#b8b8b8", margin: "0 auto 1rem" }} />
        <p style={{ color: "#b8b8b8", fontSize: "1.1rem" }}>No notes yet. Create your first note!</p>
      </div>
    );

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note._id} className="note-item">
          <div className="note-content">
            <h2 className="note-title">{note.title}</h2>
            <p className="note-text">{note.content}</p>
            <div className="note-date">
              <Calendar size={14} />
              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </div>
          </div>
          <div className="note-actions">
            <button
              className="note-action-btn"
              title="Delete"
              onClick={() => handleDelete(note._id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}