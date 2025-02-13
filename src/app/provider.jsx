"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/Header";
import { MessageContext } from "@/context/messageContext";
import { SidebarContext } from "@/context/sidebarContext";
import AppSidebar from "@/components/AppSidebar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActionContext } from "@/context/actionContext";

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState();

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
    console.log("Sidebar toggled to", open);
  };

  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >
      <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
        <MessageContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction }}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
            >
              <Header />
              <SidebarProvider>
                <div className={`${open ? "flex" : ""}`}>
                  {open && <AppSidebar />}
                  <main className="flex-1">{children}</main>
                </div>
              </SidebarProvider>
            </NextThemesProvider>
          </ActionContext.Provider>
        </MessageContext.Provider>
      </SidebarContext.Provider>
    </PayPalScriptProvider>
  );
}

export default Provider;
