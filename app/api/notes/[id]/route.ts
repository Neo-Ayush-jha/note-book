import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { authenticateRequest, unauthorizedResponse } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await authenticateRequest(req);

        if (!authUser) {
            return unauthorizedResponse("Please login to update notes");
        }

        const { id } = await params;
        const { title, content } = await req.json();

        if (!title || !content) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Please provide title and content",
                }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        await connectDB();

        const note = await Note.findById(id);

        if (!note) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Note not found",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        if (note.userId.toString() !== authUser.userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You don't have permission to update this note",
                }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );

        return new Response(
            JSON.stringify({
                success: true,
                message: "Note updated successfully",
                data: updatedNote,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Update note error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await authenticateRequest(req);

        if (!authUser) {
            return unauthorizedResponse("Please login to delete notes");
        }

        const { id } = await params;

        await connectDB();

        const note = await Note.findById(id);

        if (!note) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Note not found",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        if (note.userId.toString() !== authUser.userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "You don't have permission to delete this note",
                }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        await Note.findByIdAndDelete(id);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Note deleted successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Delete note error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}