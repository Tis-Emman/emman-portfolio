import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getAdminTokenFromRequest, verifyTokenFromString } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    // Verify admin token
    const token = getAdminTokenFromRequest(request);
    if (!token || !verifyTokenFromString(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Missing sessionId or message" },
        { status: 400 }
      );
    }

    // Verify session exists
    const { data: session, error: sessionError } = await supabaseServer
      .from("chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Save admin message to database
    const { data: savedMessage, error: saveError } = await supabaseServer
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "admin",
        content: message,
      })
      .select();

    if (saveError) {
      console.error("Error saving admin message:", saveError);
      throw saveError;
    }

    // Update session to mark that admin has responded
    await supabaseServer
      .from("chat_sessions")
      .update({
        admin_responded: true,
        last_message_time: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({
      success: true,
      message: savedMessage[0],
    });
  } catch (error) {
    console.error("Error in admin respond:", error);
    return NextResponse.json(
      { error: "Failed to send response" },
      { status: 500 }
    );
  }
}
