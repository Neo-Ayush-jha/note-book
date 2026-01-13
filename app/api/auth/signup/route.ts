import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide name, email, and password",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Password must be at least 6 characters long",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User with this email already exists",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
