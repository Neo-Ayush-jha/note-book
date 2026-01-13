/**
 * Get auth token from localStorage
 */
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export async function fetchNotes() {
    const res = await fetch("/api/notes", {
        cache: "no-store",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notes");
    }
    const response = await res.json();
    return response.data || response;
}

export async function createNote(data: { title: string; content: string }) {
    const res = await fetch("/api/notes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create note");
    }
    const response = await res.json();
    return response.data || response;
}

export async function updateNote(
    id: string,
    data: { title: string; content: string }
) {
    const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update note");
    }
    const response = await res.json();
    return response.data || response;
}

export async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete note");
    }
    const result = await res.json();
    return result;
}