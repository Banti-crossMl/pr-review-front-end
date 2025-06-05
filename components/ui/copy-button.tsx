"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: "outline" | "ghost";
  iconOnly?: boolean;
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  iconOnly = false,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={variant}
            className={cn(
              "relative transition-all",
              iconOnly ? "h-8 w-8 p-0" : "h-8",
              className
            )}
            onClick={copyToClipboard}
            {...props}
          >
            <span className={cn(iconOnly ? "sr-only" : "mr-2", hasCopied && "opacity-0")}>
              {iconOnly ? "Copy" : "Copy code"}
            </span>
            <span className={cn(iconOnly ? "sr-only" : "mr-2", !hasCopied && "absolute opacity-0")}>
              Copied!
            </span>
            {hasCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {hasCopied ? "Copied!" : "Copy code"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}