"use client";

import React, { useContext } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import History from "./History";
import Footer from "./Footer";
import { SidebarContext } from "@/context/sidebarContext";
import Link from "next/link";

function AppSidebar() {
  const { open, toggleSidebar } = useContext(SidebarContext);

  return (
    <Sidebar>
      <SidebarHeader className="pt-4 px-4 pb-5 bg-black border-b-2">
        <div className="flex flex-col gap-y-4">
          <Image
            src="/logo.png"
            alt="vo_logo"
            className="cursor-pointer"
            height={50}
            width={50}
            onClick={toggleSidebar}
          />
          <Link href={"/"}>
          <Button variant="outline" className="w-[95%]">
            <Plus /> New Chat
          </Button>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 pt-2 bg-black">
        <History />
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <Footer />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;