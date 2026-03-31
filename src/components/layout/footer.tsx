import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
        <div className="flex items-center gap-1">
          <span>2023-{currentYear}</span>
          <span>&copy;</span>
          <Link href="https://gitsam.com" className="font-medium hover:text-primary transition-colors">
            GITSAM
          </Link>
        </div>
        
        <span className="hidden md:inline text-border">|</span>
        
        <div className="flex items-center gap-4">
          <Link 
            href="https://creativecommons.org/licenses/by-nc/4.0/" 
            target="_blank" 
            className="hover:text-primary transition-colors"
          >
            CC BY-NC 4.0
          </Link>
          <Link 
            href="https://gitsam.com/disclaimer.html" 
            className="hover:text-primary transition-colors"
          >
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
