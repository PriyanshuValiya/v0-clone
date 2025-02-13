import { codeSession } from "@/configs/GeminiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { prompt } = await req.json();

    try {
        const res = await codeSession.sendMessage(prompt);
        const result = res.response.text();

        return NextResponse.json(JSON.parse(result));
    } catch (err) {
        return NextResponse.json({ message: "Error while generating code"});
    }
}