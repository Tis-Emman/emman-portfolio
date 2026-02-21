import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getAdminTokenFromRequest, verifyTokenFromString } from "@/lib/admin-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Verify admin token
    const token = getAdminTokenFromRequest(request);
    if (!token || !verifyTokenFromString(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    // Fetch session details
    const { data: session, error: sessionError } = await supabaseServer
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Fetch all messages in session
    const { data: messages, error: messagesError } = await supabaseServer
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      throw messagesError;
    }

    return NextResponse.json({
      session,
      messages,
    });
  } catch (error) {
    console.error("Error in GET specific session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}
