import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { authenticateRequest, unauthorizedResponse } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authUser = await authenticateRequest(request);

        if (!authUser) {
            return unauthorizedResponse("Please login to access notes");
        }

        await connectDB();

        const notes = await Note.find({ userId: authUser.userId })
            .sort({ createdAt: -1 });

        return new Response(
            JSON.stringify({
                success: true,
                data: notes,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Get notes error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const authUser = await authenticateRequest(request);

        if (!authUser) {
            return unauthorizedResponse("Please login to create notes");
        }

        const { title, content } = await request.json();

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

        const newNote = new Note({
            title,
            content,
            userId: authUser.userId,
        });

        await newNote.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Note created successfully",
                data: newNote,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Create note error:", error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : "Internal server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}   