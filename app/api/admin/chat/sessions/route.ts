import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getAdminTokenFromRequest, verifyTokenFromString } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    // Verify admin token
    const token = getAdminTokenFromRequest(request);
    if (!token || !verifyTokenFromString(token)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabaseServer
      .from("chat_sessions")
      .select(
        `
        id,
        visitor_id,
        visitor_name,
        visitor_email,
        created_at,
        last_message_time,
        status,
        admin_responded,
        chat_messages!inner(content, sender, created_at)
      `
      )
      .order("last_message_time", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }

    // Format response with last message preview
    const formattedSessions = sessions.map((session: any) => {
      const lastMessage = session.chat_messages?.[
        session.chat_messages.length - 1
      ] || { content: "", sender: "" };

      return {
        ...session,
        lastMessage: lastMessage.content,
        lastMessageSender: lastMessage.sender,
        unreadCount: session.chat_messages?.filter(
          (m: any) => !m.is_read && m.sender === "user"
        ).length || 0,
        chat_messages: undefined, // Remove detailed messages from list view
      };
    });

    return NextResponse.json({
      sessions: formattedSessions,
      total: formattedSessions.length,
    });
  } catch (error) {
    console.error("Error in GET sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
