import { NextRequest } from "next/server";
import { verifyToken, extractTokenFromHeader, JWTPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return null;
    }

    const user = verifyToken(token);
    return user;
  } catch {
    return null;
  }
}


export function unauthorizedResponse(message: string = "Unauthorized") {
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}


export async function requireAuth(
  request: NextRequest
): Promise<JWTPayload> {
  const user = await authenticateRequest(request);
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}
