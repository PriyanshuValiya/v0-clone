import { chatSession } from "@/configs/GeminiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ status: 400, error: "Prompt is required" });
    }

    const res = await chatSession.sendMessage(prompt);
    const finalResult = res.response.text();

    return NextResponse.json({ result: finalResult });
  } catch (err) {
    console.error("Error in chat session:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
