"use client";

import { useState, useEffect } from "react";
import { File, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CodeComparison } from "@/lib/mock-data";

interface FileSidebarProps {
  files: CodeComparison[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
}

export function FileSidebar({
  files,
  activeFileId,
  onSelectFile,
}: FileSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed left-4 top-4 z-40"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 border-r bg-card transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold">Files</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="px-2 py-2">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => {
                  onSelectFile(file.id);
                  if (isMobile) setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm text-left mb-1 transition-colors",
                  activeFileId === file.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
                )}
              >
                <File className="h-4 w-4" />
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
