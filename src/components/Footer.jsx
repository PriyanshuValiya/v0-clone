import { Settings, Wallet } from "lucide-react";
import Link from "next/link";
import React from "react";

const options = [
  {
    name: "Plus Plan",
    icon: Wallet,
    link: "/pricing"
  },
  {
    name: "Setting",
    icon: Settings,
    link: "#"
  }
];

function Footer() {
  return (
    <div className="border-t-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-900 hover:cursor-pointer rounded-lg ">
          <Link href={option.link}>
          <div className="flex items-center gap-x-4">
            <option.icon />
            <span>{option.name}</span>
          </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Footer;
