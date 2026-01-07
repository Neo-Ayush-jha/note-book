export async function fetchNotes(){
    const res = await fetch('/api/notes',{cache:'no-store'});
    if(!res.ok){
        throw new Error("Failed to fetch notes");
    }
    const notes = await res.json();
    return notes;
}

export async function createNote(data:{title:string; content:string}){
    const res = await fetch('/api/notes',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data),
    });
    if(!res.ok){
        throw new Error("Failed to create note");
    }
    const newNote = await res.json();
    return newNote;
}

export async function updateNote(id:string, data:{title:string; content:string}){
    const res = await fetch(`/api/notes/${id}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data),
    }); 
    if(!res.ok){
        throw new Error("Failed to update note");
    }
    const updatedNote = await res.json();
    return updatedNote;
}

export async function deleteNote(id:string){
    const res = await fetch(`/api/notes/${id}`,{
        method:'DELETE',
    });
    if(!res.ok){
        throw new Error("Failed to delete note");
    }
    const result = await res.json();
    return result;
}