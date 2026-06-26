"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Star } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-red-600 text-white text-center -rotate-1">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Star className="h-4 w-4 text-yellow-400" />
        <MadeWithDyad />
        <Star className="h-4 w-4 text-yellow-400" />
      </div>
      <p className="text-sm">© 2024 TodoLUIS. All rights reserved.</p>
    </footer>
  );
};