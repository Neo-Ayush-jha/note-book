import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide email and password",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email or password",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid email or password",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
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
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
