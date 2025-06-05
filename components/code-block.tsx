"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Code as CodeIcon, FileCode, Eye, Plus, Minus, MessageSquare } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CodeBlockProps {
  filename: string;
  oldCode: string;
  newCode: string;
  summary: string;
  language: string;
  timestamp: string;
  author: string;
}

export function CodeBlock({
  filename,
  oldCode,
  newCode,
  summary,
  language,
  timestamp,
  author,
}: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const formattedDate = new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Split code into lines and compare
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  
  // Simple line-by-line comparison
  const getLineStatus = (line: string, index: number, isOld: boolean) => {
    if (isOld) {
      return newLines[index] !== line ? 'removed' : 'unchanged';
    } else {
      return oldLines[index] !== line ? 'added' : 'unchanged';
    }
  };

  const renderCode = (code: string, isOld: boolean) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      const status = getLineStatus(line, index, isOld);
      const bgColor = status === 'removed' ? 'bg-red-500/10' 
                   : status === 'added' ? 'bg-green-500/10'
                   : '';
      const icon = status === 'removed' ? <Minus className="h-3 w-3 text-red-500" />
                : status === 'added' ? <Plus className="h-3 w-3 text-green-500" />
                : null;
      
      return (
        <div key={index} className={cn("flex items-start gap-2 px-1", bgColor)}>
          <div className="w-4 flex-shrink-0 pt-1">
            {icon}
          </div>
          <pre className="flex-1">{line}</pre>
        </div>
      );
    });
  };

  return (
    <Card className="mb-6 overflow-hidden transition-all duration-300 border border-border/50 hover:border-border/80">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-muted/50">
        <div className="flex items-center space-x-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{filename}</h3>
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Toggle comments</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{expanded ? "Collapse" : "Expand"}</span>
          </Button>
        </div>
      </CardHeader>

      {/* Summary always visible */}
      <CardContent className="p-4 pb-0">
        <p className="text-sm text-foreground/90 mb-4">{summary}</p>
        <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-4 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>Modified by {author}</span>
          </div>
          <div className="flex items-center">
            <CodeIcon className="h-3 w-3 mr-1" />
            <span>Last updated on {formattedDate}</span>
          </div>
        </div>
      </CardContent>

      {/* Code comparison (expandable) */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton value={oldCode} iconOnly />
              </div>
              <div className="font-mono text-xs p-3 rounded-md bg-muted/70 overflow-x-auto">
                {renderCode(oldCode, true)}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">Original code</div>
            </div>
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton value={newCode} iconOnly />
              </div>
              <div className="font-mono text-xs p-3 rounded-md bg-muted/30 overflow-x-auto">
                {renderCode(newCode, false)}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">Updated code</div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}