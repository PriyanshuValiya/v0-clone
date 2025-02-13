"use client";

import React, { useState, useContext } from "react";
import { Textarea } from "./ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Loader2, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";
import { MessageContext } from "@/context/messageContext";
import { UserContext } from "@/context/userContext";
import { SidebarContext } from "@/context/sidebarContext";
const suggestions = [
  "Create ToDo App in React",
  "Create Budget Track App",
  "Create Quiz App On History",
  "Create Gym Management Portal Dashboard",
  "Create Login Signup Screen",
];

function Hero() {
  const [input, setInput] = useState("");
  const [load, setLoad] = useState(false);
  const { messages, setMessages } = useContext(MessageContext);
  const { open, setOpen } = useContext(SidebarContext);
  const { user } = useContext(UserContext);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async (prompt) => {
    if (!user) {
      return toast({
        title: "Please Sign-Up to get authorized",
      });
    } else if (!prompt.trim()) {
      return toast({
        title: "Please enter a prompt",
      });
    }

    const inputPrompt = {
      role: "user",
      content: prompt,
    };

    setMessages([inputPrompt]);

    setLoad(true);

    try {
      const { data, error } = await supabase
        .from("workspace")
        .insert([
          {
            user: user?.id,
            prompt: JSON.stringify([inputPrompt]),
            title: `${inputPrompt.content.split(" ")[0]} ${inputPrompt.content.split(" ")[1]} ${inputPrompt.content.split(" ")[2]}`,
          },
        ])
        .select();

      if (error) {
        return alert(error.message);
      }

      router.push(`/chat/${data[0].id}`);
    } catch (err) {
      console.error("Error inserting data:", err);
    } finally {
      setInput("");
      setLoad(false);
    }
  };

  return (
    <div className={`${open ? "ml-16 mt-24" : "ml-60 mt-24"}`}>
    <div className="flex flex-col items-center gap-2 text-white">
      <h2 className="text-[3rem] font-sans font-bold">
        What can I help you ship?
      </h2>

      <div className="border w-full md:w-[55%] p-3 rounded-xl flex flex-col gap-2 bg-black/90 mt-3">
        <Textarea
          value={input}
          className="text-white placeholder:text-gray-400 border border-black focus:ring-0 focus:border-black"
          placeholder="Ask v0 a question..."
          onChange={(e) => setInput(e.target.value)}
          rows={3}
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
              className="text-gray-300 border-gray-600 px-3 py-1 rounded-lg"
            >
              + Project
            </Button>
            <Button
              variant="outline"
              className="p-2 rounded-lg hover:bg-white hover:text-black"
              onClick={() => handleGenerate(input)}
            >
              {load ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowUp size={22} />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-[55%] mt-3 p-2 flex justify-center flex-wrap gap-2">
        {suggestions.map((ele, idx) => (
          <Badge
            className="cursor-pointer mt-1"
            variant="outline"
            key={idx}
            onClick={() => {
              setInput(ele);
              handleGenerate(ele);
            }}
          >
            {ele}
          </Badge>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Hero;
