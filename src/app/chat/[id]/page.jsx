import ChatView from "@/components/ChatView";
import CodeView from "@/components/CodeView";
import React from "react";

async function ChatPage({ params }) {
  const { id } = await params;

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-7">
        <ChatView id={id} />
        <div className="col-span-2">
          <CodeView id={id} />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
