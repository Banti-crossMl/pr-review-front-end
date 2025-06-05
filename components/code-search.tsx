"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CodeSearchProps {
  onSearch: (query: string) => void;
}

export function CodeSearch({ onSearch }: CodeSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by filename or content..."
        value={query}
        onChange={handleSearch}
        className="pl-10 h-10"
      />
    </div>
  );
}