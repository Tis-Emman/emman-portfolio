import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const groq = new Groq({
  apiKey: process.env.APIKEY,
});

const SYSTEM_PROMPT = `You are Emman's personal AI assistant for his developer portfolio.

Your role:
- Represent Emmanuel Dela Pena (Emman) professionally.
- Answer questions about his background, projects, skills, and experience.
- Assist visitors by explaining his work clearly and confidently.
- Keep responses friendly, professional, and concise.

About Emman:
- BSIT student at STI College Baliuag, President's Lister (Top Student)
- Strong in: Web Development, Next.js, React, Node.js, SQL, Firebase, Android, Python, C#, Git
- Passionate about: AI, cybersecurity, UI/UX design, machine learning, automation
- Built multiple systems including:
  - Inventory management system using C# and SQL
  - Android apps with Firebase & SQLite
  - AI-powered portfolio chatbot
  - Full-stack web applications
- Experience in tech support and customer service
- Hobbies: guitar, gym, coding, gaming, cooking

Behavior rules:
- Always speak as Emman's AI assistant, not as Emman.
- Do NOT say "I am Emman". Instead say "Emman is..." or "He has..."
- Be professional, friendly, confident, and helpful.
- If asked technical questions, give clear and practical answers.
- If asked about hiring, highlight Emman's skills, work ethic, and strengths.`;

export async function POST(request: Request) {
  try {
    const { message, sessionId, visitorId } = await request.json();

    if (!message || !sessionId || !visitorId) {
      return NextResponse.json(
        { error: "Missing required fields: message, sessionId, visitorId" },
        { status: 400 }
      );
    }

    // Check if admin has already responded to this session
    const { data: sessionData, error: sessionError } = await supabaseServer
      .from("chat_sessions")
      .select("admin_responded")
      .eq("id", sessionId)
      .single();

    if (sessionError && sessionError.code !== "PGRST116") {
      console.error("Error fetching session:", sessionError);
      throw sessionError;
    }

    const adminHasResponded = sessionData?.admin_responded || false;

    // Save user message to database
    const { error: userMsgError } = await supabaseServer
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "user",
        content: message,
      });

    if (userMsgError) {
      console.error("Error saving user message:", userMsgError);
      throw userMsgError;
    }

    // If admin has already responded, don't call AI - just wait for admin response
    if (adminHasResponded) {
      return NextResponse.json({
        reply: null,
        sessionId,
        message: "Admin is actively responding to this chat",
      });
    }

    // Get conversation history from database (last 10 messages)
    const { data: messageHistory, error: historyError } = await supabaseServer
      .from("chat_messages")
      .select("sender, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(10);

    if (historyError) {
      console.error("Error fetching message history:", historyError);
      throw historyError;
    }

    // Format messages for Groq API
    const groqMessages: any[] = messageHistory.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    // Call Groq AI with conversation history
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system" as const,
          content: SYSTEM_PROMPT,
        },
        ...(groqMessages as any),
      ] as any,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content || "No response";

    // Save bot response to database
    const { error: botMsgError } = await supabaseServer
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "bot",
        content: reply,
        processed_by_ai: true,
      });

    if (botMsgError) {
      console.error("Error saving bot message:", botMsgError);
      throw botMsgError;
    }

    // Update last_message_time in session
    await supabaseServer
      .from("chat_sessions")
      .update({ last_message_time: new Date().toISOString() })
      .eq("id", sessionId);

    return NextResponse.json({ reply, sessionId });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
