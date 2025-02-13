"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/userContext";
import { supabase } from "@/utils/supabase";
import { HistoryIcon } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/context/sidebarContext";

function History() {
  const [history, setHistory] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getHistory = async () => {
      const { data, error } = await supabase
        .from("workspace")
        .select("id, title, created_at");
 
      if (error) {
        console.error("Error fetching history:", error);
        return;
      }

      const sortedHistory = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setHistory(sortedHistory);
    };

    getHistory();
  }, [user]);

  // useEffect(() => {
  //   console.log("History:", history);
  // }, [history]);

  return (
    <div>
      <h2 className="flex gap-x-3 opacity-60 mt-2">
        <HistoryIcon /> Recent Chats
      </h2>

      <div className="mt-5">
        {history.map((item, index) => (
          <Link href={`/chat/${item.id}`} key={index}>
            <div className="flex gap-x-3 mt-3">
              <h2 className="text-sm hover:bg-gray-900 hover:cursor-pointer rounded-lg w-full py-1 pl-2">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default History;
