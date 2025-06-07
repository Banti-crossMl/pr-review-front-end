"use client";

import { useState, useEffect } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
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
import { FileSidebar } from "@/components/file-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { resetloginUser } from "../redux/authSlice";
import { useAppDispatch } from "../redux/redux/hooks";
import RepositoryCard from "@/components/RepositoryCard";
import { fetchRepoAction } from "../redux/features/fetchrepoSlice";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import { Chat } from "@/components/chat/Chat";
import { GitHubConnect } from "@/components/GitHubConnect";

// Transform pullRequests data to match mockComparisons structure
const transformPullRequestsToComparisons = (pullRequests: any) => {
  if (!pullRequests?.data?.file_reviews) {
    return [];
  }

  return pullRequests.data.file_reviews.map(
    (fileReview: any, index: number) => ({
      id: `file-${index + 1}`,
      filename: fileReview.file || `unknown-file-${index + 1}`,
      language: fileReview.language || "text",
      oldCode: fileReview.old_code || "// No old code available",
      newCode: fileReview.new_code || "// No new code available",
      summary:
        fileReview.summary || fileReview.analysis || "No summary available",
      timestamp:
        pullRequests.data.pr_details?.created_at || new Date().toISOString(),
      author: pullRequests.data.pr_details?.user?.login || "Unknown Author",
      // Additional fields from your pull request data
      analysis: fileReview.analysis,
      code_changes: fileReview.code_changes,
      improvements: fileReview.improvements,
      changes: fileReview.changes,
    })
  );
};

export default function DashboardPage() {
  useAuthRedirect({ redirectIfAuthenticated: false });

  const {
    pullRequests,
    isPullRequestsError,
    isPullRequestsPending,
    isPullRequestsSuccess,
  } = useSelector((state: any) => state.reviewcode);

  const { repos, isPendingRepo } = useSelector((state: any) => state.repo);

  // Transform pullRequests to comparisons format
  const [comparisons, setComparisons] = useState(() =>
    transformPullRequestsToComparisons(pullRequests)
  );

  const [activeFileId, setActiveFileId] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showRepoCard, setShowRepoCard] = useState(false);
  const [showGitHubDialog, setShowGitHubDialog] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  // Update comparisons when pullRequests changes
  useEffect(() => {
    const transformed = transformPullRequestsToComparisons(pullRequests);
    setComparisons(transformed);

    // Set active file ID to first file if available
    if (transformed.length > 0 && !activeFileId) {
      setActiveFileId(transformed[0].id);
    }
  }, [pullRequests]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSearch = (query: string) => {
    const allComparisons = transformPullRequestsToComparisons(pullRequests);

    if (!query.trim()) {
      setComparisons(allComparisons);
      return;
    }

    const filtered = allComparisons.filter(
      (comp: any) =>
        comp.filename.toLowerCase().includes(query.toLowerCase()) ||
        comp.oldCode.toLowerCase().includes(query.toLowerCase()) ||
        comp.newCode.toLowerCase().includes(query.toLowerCase()) ||
        comp.summary.toLowerCase().includes(query.toLowerCase()) ||
        (comp.analysis &&
          comp.analysis.toLowerCase().includes(query.toLowerCase()))
    );

    setComparisons(filtered);

    if (
      filtered.length > 0 &&
      !filtered.some((f: any) => f.id === activeFileId)
    ) {
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

  const handleclose = () => {
    setShowRepoCard(false);
  };

  const activeComparison =
    comparisons.find((comp: any) => comp.id === activeFileId) || comparisons[0];

  console.log("activeComparison", activeComparison);

  const severityStyles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 border-red-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
    CRITICAL: "bg-orange-100 text-orange-700 border-orange-300",
  };

  function HighlightedSeverity({ children }: { children: string }) {
    const level = children.trim().toUpperCase();
    const style = severityStyles[level] || "bg-gray-100 text-gray-700";
    return (
      <span
        className={`px-2 py-1 rounded text-sm font-semibold border ${style}`}
      >
        {level}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FileSidebar
        files={comparisons}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
        // onSearch={handleSearch}
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
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Code Review Analysis</h1>
                {pullRequests?.data?.pr_details && (
                  <p className="text-sm text-muted-foreground">
                    PR #{pullRequests.data.pr_details.number}:{" "}
                    {pullRequests.data.pr_details.title}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
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

        {/* Main Content */}
        <div
          className={`relative ${
            showRepoCard ? "blur-sm pointer-events-none select-none" : ""
          }`}
        >
          <main className="container py-6 px-4 sm:px-6">
            {isPullRequestsPending ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Loader />
                <p className="text-muted-foreground mt-4">
                  Loading pull request data...
                </p>
              </div>
            ) : isPullRequestsError ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Github className="h-16 w-16 text-red-500/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-red-500">
                  Error Loading Pull Request
                </h2>
                <p className="text-muted-foreground">
                  Failed to load pull request data. Please try again.
                </p>
              </div>
            ) : comparisons.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Github className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  No Pull Request Data
                </h2>
                <p className="text-muted-foreground">
                  Connect a repository and analyze a pull request to see code
                  comparisons
                </p>
              </div>
            ) : activeComparison ? (
              <div className="space-y-6">
                {/* Pull Request Summary */}
                {pullRequests?.data?.summary && (
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Review Summary</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {pullRequests.data.summary}
                    </div>
                  </div>
                )}

                {/* Code Block */}
                <CodeBlock
                  filename={activeComparison.filename}
                  oldCode={activeComparison.oldCode}
                  newCode={activeComparison.newCode}
                  summary={activeComparison.summary}
                  language={activeComparison.language}
                  timestamp={activeComparison.timestamp}
                  author={activeComparison.author}
                />

                {/* Additional Analysis */}
                {/* {activeComparison.analysis && (
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      <ReactMarkdown>{activeComparison.analysis}</ReactMarkdown>
                    </div>
                  </div>
                )} */}

                {activeComparison.analysis && (
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <h3 className="font-bold text-lg mb-4">
                      Detailed Analysis
                    </h3>
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-gray-100 prose-pre:rounded prose-pre:p-4">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-xl font-bold mt-6" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-lg font-semibold mt-4"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-md font-medium mt-3"
                              {...props}
                            />
                          ),
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }: any) =>
                            inline ? (
                              <code className="bg-gray-200 px-1 rounded text-[13px]">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                                <code>{children}</code>
                              </pre>
                            ),
                          li: ({ node, ...props }) => (
                            <li className="mb-1" {...props} />
                          ),
                          strong: ({ children }) => {
                            if (
                              typeof children === "string" &&
                              severityStyles[children.trim().toUpperCase()]
                            ) {
                              return (
                                <HighlightedSeverity>
                                  {children as string}
                                </HighlightedSeverity>
                              );
                            }
                            return <strong>{children}</strong>;
                          },
                        }}
                      >
                        {activeComparison.analysis}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Code Improvements */}

                {activeComparison.improvements && (
                  <div className="bg-muted/30 rounded-xl p-6 border border-muted shadow-sm">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      🎯 Suggested Improvements
                    </h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                      <ReactMarkdown>
                        {activeComparison.improvements}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Change Statistics */}
                {activeComparison.changes && (
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h3 className="font-semibold mb-2">Change Statistics</h3>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">
                        +{activeComparison.changes.additions} additions
                      </span>
                      <span className="text-red-600">
                        -{activeComparison.changes.deletions} deletions
                      </span>
                    </div>
                  </div>
                )}
              </div>
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

        {/* Repo Card */}
        {showRepoCard && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-background overflow-y-auto">
            <div className="flex justify-end p-4">
              <Button onClick={handleclose} variant="ghost" size="sm">
                Close
              </Button>
            </div>
            {isPendingRepo ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <Loader />
              </div>
            ) : repos?.data && repos.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 p-4 lg:grid-cols-3 gap-6">
                {repos.data.map((repo: any) => (
                  <RepositoryCard
                    key={repo.id}
                    repository={repo}
                    handleclose={handleclose}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <Github className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  No Repositories Found
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Make sure your GitHub account is connected and you have
                  repositories to display.
                </p>
              </div>
            )}
          </div>
        )}

        {/* GitHub Dialog */}
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

        {/* Floating ChatBot Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowChatBot(!showChatBot)}
            className="rounded-full h-14 w-14 p-0 shadow-lg bg-primary text-white hover:bg-primary/90"
          >
            💬
          </Button>
        </div>

        {/* ChatBot UI */}
        {showChatBot && (
          <div className="fixed bottom-20 right-6 w-[90vw] sm:w-[40vw] bg-white dark:bg-zinc-900 border rounded-xl shadow-xl z-50 overflow-hidden">
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
}
