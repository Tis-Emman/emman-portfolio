import { cookies } from "next/headers";

interface AdminTokenPayload {
  adminId: string;
  iat: number;
  exp: number;
}

// Server-only function - use only in Server Components and API routes
export async function verifyAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    ) as AdminTokenPayload;

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload.adminId;
  } catch {
    return null;
  }
}

// For use in API routes to verify tokens from request headers
export function getAdminTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

// For use in API routes to parse and verify tokens from strings
export function verifyTokenFromString(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    ) as AdminTokenPayload;

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload.adminId;
  } catch {
    return null;
  }
}

// Client-only function - use in Client Components
export function isAdminTokenValid(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("admin_token");
  if (!token) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    ) as AdminTokenPayload;

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
