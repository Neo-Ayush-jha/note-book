import {connectDB} from "@/lib/mongodb";
import {Note} from "@/models/Note";


export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    const {title, content} = await req.json();
    await connectDB();
    const updatedNote = await Note.findByIdAndUpdate(id, {title, content}, {new:true});
    if(!updatedNote){
        return new Response(JSON.stringify({message:"Note not found"}), {status:404});
    }
    return new Response(JSON.stringify(updatedNote), {status:200});
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
    const {id} = await params;
    await connectDB();
    const deletedNote = await Note.findByIdAndDelete(id);
    if(!deletedNote){
        return new Response(JSON.stringify({message:"Note not found"}), {status:404});
    }
    return new Response(JSON.stringify({message:"Note deleted successfully"}), {status:200});
}