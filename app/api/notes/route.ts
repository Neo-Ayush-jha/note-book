import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";


export async function GET(){
    await connectDB();
    const notes = await Note.find().sort({createdAt:-1});
    return new Response (JSON.stringify(notes), {status:200});
}

export async function POST(request: Request){
    const {title, content} = await request.json();
    await connectDB();
    const newNote = new Note({title, content});
    await newNote.save();
    return new Response (JSON.stringify(newNote), {status:201});
}   