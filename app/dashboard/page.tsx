"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { CodeSearch } from "@/components/code-search";
import { FileSidebar } from "@/components/file-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockComparisons } from "@/lib/mock-data";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { resetloginUser } from "../redux/authSlice";
import { useAppDispatch } from "../redux/redux/hooks";

export default function DashboardPage() {
  useAuthRedirect({ redirectIfAuthenticated: false });
  const [comparisons, setComparisons] = useState(mockComparisons);

  const [activeFileId, setActiveFileId] = useState(
    mockComparisons[0]?.id || ""
  );
  const dispatch = useAppDispatch();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setComparisons(mockComparisons);
      return;
    }

    const filtered = mockComparisons.filter(
      (comp) =>
        comp.filename.toLowerCase().includes(query.toLowerCase()) ||
        comp.oldCode.toLowerCase().includes(query.toLowerCase()) ||
        comp.newCode.toLowerCase().includes(query.toLowerCase()) ||
        comp.summary.toLowerCase().includes(query.toLowerCase())
    );

    setComparisons(filtered);

    // Update active file if current one is filtered out
    if (filtered.length > 0 && !filtered.some((f) => f.id === activeFileId)) {
      setActiveFileId(filtered[0].id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("sessionId");
    dispatch(resetloginUser());
    router.push("/login");
  };

  // Find the active comparison
  const activeComparison =
    comparisons.find((comp) => comp.id === activeFileId) || comparisons[0];

  return (
    <div className="min-h-screen bg-background">
      <FileSidebar
        files={comparisons}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        <header className="sticky top-0 z-10 h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="hidden lg:flex"
              >
                {sidebarVisible ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            {!isMobile && (
              <h1 className="text-lg font-semibold">Code Comparison</h1>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <CodeSearch onSearch={handleSearch} />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </header>

        <main className="container py-6 px-4 sm:px-6">
          {activeComparison ? (
            <CodeBlock
              filename={activeComparison.filename}
              oldCode={activeComparison.oldCode}
              newCode={activeComparison.newCode}
              summary={activeComparison.summary}
              language={activeComparison.language}
              timestamp={activeComparison.timestamp}
              author={activeComparison.author}
            />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-xl font-semibold mb-2">No files found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search query
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
