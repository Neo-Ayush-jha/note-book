"use client";

import { deleteNote, fetchNotes, updateNote } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { Trash2, Calendar, StickyNote, Edit2, Check, X } from "lucide-react";

interface INote {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoteList({ refresh, searchQuery }: { refresh: number; searchQuery: string }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<INote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  async function handleDelete(id: string) {
    await deleteNote(id);
    fetchNotesData();
  }

  function startEditing(note: INote) {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim() || !editContent.trim()) return;
    await updateNote(id, { title: editTitle, content: editContent });
    setEditingId(null);
    fetchNotesData();
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="text-gray-300 mt-4">Loading notes...</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
        <StickyNote size={48} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No notes yet. Create your first note!</p>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
        <StickyNote size={48} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No notes found matching "{searchQuery}"</p>
        <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
      </div>
    );
  }

  return (
    <ul className="note-list">
      {filteredNotes.map((note) => (
        <li key={note._id} className="note-item">
          {editingId === note._id ? (
            <div className="note-edit-form">
              <input
                className="note-edit-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                className="note-edit-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                rows={4}
              />
              <div className="note-edit-actions">
                <button
                  className="note-save-btn"
                  onClick={() => saveEdit(note._id)}
                >
                  <Check size={18} />
                  Save
                </button>
                <button
                  className="note-cancel-btn"
                  onClick={cancelEditing}
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  className="note-action-btn edit-btn"
                  title="Edit"
                  onClick={() => startEditing(note)}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  className="note-action-btn delete-btn"
                  title="Delete"
                  onClick={() => handleDelete(note._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}