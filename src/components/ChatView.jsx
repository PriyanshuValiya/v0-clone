"use client";

import Image from "next/image";
import { MessageContext } from "@/context/messageContext";
import { UserContext } from "@/context/userContext";
import { supabase } from "@/utils/supabase";
import React, { useState, useContext, useEffect, useRef } from "react";
import logo from "../../public/logo.png";
import { Textarea } from "./ui/textarea";
import { ArrowUp, Loader2, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkDown from "react-markdown";

const dummyPrompt = `
"You are an AI Assistant experienced in React Development.
  GUIDELINES:
  - Tell the user what you are building.
  - Response should be less than 15 lines.
  - Skip code examples and commentary."`;

function ChatView({ id }) {
  const { messages, setMessages } = useContext(MessageContext);
  const { user } = useContext(UserContext);
  const [input, setInput] = useState("");
  const [load, setLoad] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("workspace")
          .select("prompt")
          .eq("id", id)
          .single();

        if (error) {
          console.log(error);
        };

        setMessages(JSON.parse(data.prompt) || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (id) getMessages();
  }, [id]);

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1]?.role;

      if (role === "user") {
        getAiResponse();
      }
    }
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getAiResponse = async () => {
    setLoad(true);
    const PROMPT = JSON.stringify(messages) + dummyPrompt;

    const res = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: PROMPT }),
    });

    const data = await res.json();

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     role: "ai",
    //     content:
    //       "Okay, I will create a simple budget tracking application using React. This app will allow users to input income and expenses, and it will display a summary of their budget. It will be a functional app without styling.",
    //   },
    // ]);

    setMessages((prev) => [...prev, { role: "ai", content: data.result }]);
    setLoad(false);

    try {
      const { error } = await supabase
        .from("workspace")
        .update({ prompt: JSON.stringify(messages) })
        .eq("id", id);

      if (error) {
        console.error("Error updating messages:", error);
      }
    } catch (err) {
      console.error("Error updating messages:", err);
    }
  };

  const handleGenerate = (input) => {
    if (input === "") {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
  };

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <div className="relative h-[84vh] flex flex-col">
      <div ref={chatRef} className="flex-1 overflow-y-auto">
        {messages &&
          messages.map((ele, idx) => (
            <div
              key={idx}
              className={`flex items-start px-5 py-1 rounded-lg ${
                ele?.role === "user" ? "bg-gray-900" : "bg-gray-800"
              } gap-x-5 mt-3`}
            >
              {ele?.role === "user" ? (
                <Image
                  src={user?.user_metadata?.avatar_url}
                  alt="user"
                  className="rounded-full"
                  height={25}
                  width={25}
                />
              ) : (
                <Image
                  src={logo}
                  alt="v0"
                  className="rounded-full mt-1"
                  height={30}
                  width={30}
                />
              )}
              <ReactMarkDown className="flex flex-col font-base">
                {ele?.content}
              </ReactMarkDown>
            </div>
          ))}

        {load && <Skeleton className="w-[475px] h-[100px] rounded-lg mt-3" />}
      </div>

      <div className="border w-full p-3 rounded-xl flex flex-col gap-2 bg-black/90 mt-3">
        <Textarea
          value={input}
          className="outline-none text-white placeholder:text-gray-400 border-none focus:ring-0"
          placeholder="Ask a follow-up..."
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          required
        />

        <div className="flex justify-between items-center">
          <Paperclip
            className="cursor-pointer text-gray-400 hover:text-white"
            size={20}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="p-2 rounded-lg hover:bg-white hover:text-black"
              onClick={() => handleGenerate(input)}
            >
              <ArrowUp size={22} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;
