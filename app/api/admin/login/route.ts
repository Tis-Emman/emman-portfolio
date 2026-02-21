import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import crypto from "crypto";

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate simple JWT-like token
function generateToken(adminId: string): string {
  const payload = {
    adminId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    // Find admin user
    const { data: admin, error } = await supabaseServer
      .from("admin_users")
      .select("id, email, password_hash")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    if (admin.password_hash !== passwordHash) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await supabaseServer
      .from("admin_users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", admin.id);

    // Generate token
    const token = generateToken(admin.id);

    const response = NextResponse.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email },
    });

    // Set secure cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
