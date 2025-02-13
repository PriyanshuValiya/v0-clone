"use client";

import Image from "next/image";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import googleLogo from "../../public/google.png";
import { supabase } from "@/utils/supabase";
import { LoaderCircle, LogOut } from "lucide-react";
import { SidebarContext } from "@/context/sidebarContext";  

function Header() {
  const [dialogBox, setDialogBox] = useState(false);
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toggleSidebar } = useContext(SidebarContext);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setAuth(true);
        setUser(data.session.user);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuth(!!session);
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleOnFormSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      } else {
        console.log(data);
      }

      setAuth(true);
      setUser(data.user);
      setDialogBox(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) {
      alert("Google Sign-In Failed: " + error.message);
    }
  };

  return (
    <div className="flex justify-between items-center p-3">
      <Image
        src={"/logo.png"}
        alt="vo_logo"
        className="cursor-pointer"
        height={50}
        width={50}
        onClick={toggleSidebar}
      />

      <div className="flex space-x-3">
        {!auth ? (
          <div className="flex gap-x-3">
            <Button variant="outline" className="text-base">
              Sign in
            </Button>
            <Button onClick={() => setDialogBox(true)}>Sign Up</Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            {user && user.app_metadata.provider == "google" && (
              <div className="flex justify-around items-center h-10 w-56">
                <Image
                  className="rounded-full"
                  src={user.user_metadata.avatar_url}
                  alt="user"
                  height={40}
                  width={40}
                />
                <h2 className="font-sans">{user.user_metadata.full_name}</h2>
              </div>
            )}
            <Button
              className="border border-red-600"
              variant="variant"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogBox} onOpenChange={setDialogBox}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Get Started with v0
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-2">
            <Input
              value={formData.email}
              type="email"
              placeholder="email"
              aria-label="Email"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              value={formData.password}
              type="password"
              placeholder="password"
              aria-label="Password"
              className="p-2 border border-gray-300 rounded-md"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <Button className="w-full" onClick={handleOnFormSubmit}>
              {load ? (
                <div className="flex items-center justify-center gap-x-2">
                  <LoaderCircle className="animate-spin" />
                  <p>Wait a moment...</p>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
          <div className="flex items-center justify-center text-gray-500 text-sm my-2">
            or
          </div>
          <Button
            className="flex items-center justify-center space-x-2 border border-gray-300 p-2 rounded-md"
            onClick={handleGoogleSignIn}
          >
            <Image src={googleLogo} alt="google" className="w-6 h-6" />
            <span>Sign in with Google</span>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
