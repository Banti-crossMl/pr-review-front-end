"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Github,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/code-block";
import { CodeSearch } from "@/components/code-search";
import { FileSidebar } from "@/components/file-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { mockComparisons } from "@/lib/mock-data";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { resetloginUser } from "../redux/authSlice";
import { useAppDispatch } from "../redux/redux/hooks";
import { RepositoryCard } from "../connectrepo/page";
import { repositoryData } from "@/lib/repository-data";
import { GitHubConnect } from "@/components/GitHubConnect";
import { fetchRepoAction } from "../redux/features/fetchrepoSlice";

export default function DashboardPage() {
  useAuthRedirect({ redirectIfAuthenticated: false });

  const [comparisons, setComparisons] = useState(mockComparisons);
  const [activeFileId, setActiveFileId] = useState(
    mockComparisons[0]?.id || ""
  );
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showRepoCard, setShowRepoCard] = useState(false);
  const [showGitHubDialog, setShowGitHubDialog] = useState(false);

  console.log("showGitHubDialogshowGitHubDialog", showGitHubDialog);

  const dispatch = useAppDispatch();
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

  const handlerepo = () => {
    setShowRepoCard(true);
    dispatch(fetchRepoAction());
  };

  const activeComparison =
    comparisons.find((comp) => comp.id === activeFileId) || comparisons[0];

  return (
    <div className="min-h-screen bg-background relative">
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
            {/* <CodeSearch onSearch={handleSearch} /> */}

            {/* GitHub Connect Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGitHubDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">GitHub Connect</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              // onClick={() => setShowRepoCard(true)}
              onClick={handlerepo}
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">Open Repository</span>
            </Button>
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

        {/* Main dashboard content */}
        <div
          className={`relative ${
            showRepoCard ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
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

        {/* Repository Card Modal */}
        {showRepoCard && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-background overflow-y-auto">
            <div className="flex justify-end p-4">
              <Button
                onClick={() => setShowRepoCard(false)}
                variant="ghost"
                size="sm"
              >
                Close
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 p-4 lg:grid-cols-3 gap-6">
              {repositoryData.data.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))}
            </div>
          </div>
        )}

        {/* GitHub Connect Dialog */}
        <Dialog open={showGitHubDialog} onOpenChange={setShowGitHubDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Github className="h-5 w-5 text-gray-700" />
                GitHub Integration
              </DialogTitle>
            </DialogHeader>
            <GitHubConnect />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
