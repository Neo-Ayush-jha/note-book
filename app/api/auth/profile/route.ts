import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { authenticateRequest, unauthorizedResponse } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authUser = await authenticateRequest(request);

    if (!authUser) {
      return unauthorizedResponse("Please login to access this resource");
    }

    await connectDB();

    const user = await User.findById(authUser.userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await authenticateRequest(request);

    if (!authUser) {
      return unauthorizedResponse("Please login to access this resource");
    }

    const { name } = await request.json();

    if (!name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please provide a name",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
