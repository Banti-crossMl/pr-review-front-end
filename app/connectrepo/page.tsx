"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Star,
  GitFork,
  AlertCircle,
  Lock,
  Calendar,
  User,
  ArrowLeft,
  GitPullRequest,
  Clock,
  Plus,
  Minus,
  FileText,
} from "lucide-react";
import type { Repository } from "@/lib/repository-data";

// Pull Request interface based on your JSON data
interface PullRequest {
  id: number;
  repository_name: string;
  repository_owner: string;
  number: number;
  title: string;
  body: string;
  state: string;
  user_login: string;
  html_url: string;
  additions: number;
  deletions: number;
  changed_files: number;
  draft: boolean;
  created_at: string;
  updated_at: string;
  repository: number;
}

interface PullRequestData {
  status: string;
  count: number;
  page: number;
  data: PullRequest[];
}

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const [showPullRequests, setShowPullRequests] = useState(false);
  const [pullRequestData] = useState<PullRequestData>({
    status: "success",
    count: 2,
    page: 1,
    data: [
      {
        id: 1,
        repository_name: "codeReview",
        repository_owner: "Sahilcrossml",
        number: 2,
        title: "Feature 02",
        body: "Update the main code with enhanced code",
        state: "open",
        user_login: "Sahilcrossml",
        html_url: "https://github.com/Sahilcrossml/codeReview/pull/2",
        additions: 0,
        deletions: 0,
        changed_files: 0,
        draft: false,
        created_at: "2025-06-06T09:53:26.375925Z",
        updated_at: "2025-06-06T10:56:27.491809Z",
        repository: 1,
      },
      {
        id: 2,
        repository_name: "codeReview",
        repository_owner: "Sahilcrossml",
        number: 1,
        title: "updates on the main file",
        body: "Updated changes in the main.py file",
        state: "open",
        user_login: "Sahilcrossml",
        html_url: "https://github.com/Sahilcrossml/codeReview/pull/1",
        additions: 0,
        deletions: 0,
        changed_files: 0,
        draft: false,
        created_at: "2025-06-06T09:53:26.380450Z",
        updated_at: "2025-06-06T10:56:27.495612Z",
        repository: 1,
      },
    ],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      Python:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50",
      JavaScript:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800/50",
      TypeScript:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800/50",
      Java: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800/50",
      Go: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/50",
      Rust: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50",
    };
    return (
      colors[language] ||
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50"
    );
  };

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "open":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800/50";
      case "closed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50";
      case "merged":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50";
    }
  };

  const handleExternalLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    setShowPullRequests(true);
  };

  const handleBackClick = () => {
    setShowPullRequests(false);
  };

  if (showPullRequests) {
    return (
      <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to repository</span>
            </Button>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                Pull Requests
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <GitPullRequest className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{repository.name}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {pullRequestData.count} Pull Requests
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                Page {pullRequestData.page}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {pullRequestData.data.map((pr) => (
              <Card
                key={pr.id}
                className="border border-border/50 hover:border-border transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-sm font-medium text-foreground truncate">
                          #{pr.number} {pr.title}
                        </CardTitle>
                        {pr.draft && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700/50"
                          >
                            Draft
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-muted-foreground">
                        {pr.body}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium px-2 py-1 ${getStateColor(
                          pr.state
                        )}`}
                      >
                        {pr.state}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={(e) => handleExternalLink(e, pr.html_url)}
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="sr-only">Open pull request</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{pr.user_login}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {pr.additions > 0 && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Plus className="h-3 w-3" />
                            <span>{pr.additions}</span>
                          </div>
                        )}
                        {pr.deletions > 0 && (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Minus className="h-3 w-3" />
                            <span>{pr.deletions}</span>
                          </div>
                        )}
                        {pr.changed_files > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <span>{pr.changed_files} files</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDateTime(pr.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Original repository card view
  return (
    <Card
      className="group relative h-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {repository.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{repository.owner}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {repository.private && (
              <div className="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
                <Lock className="h-3 w-3 text-red-600 dark:text-red-400" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={(e) => handleExternalLink(e, repository.html_url)}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Open repository</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {repository.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {repository.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {repository.language && (
            <Badge
              variant="outline"
              className={`text-xs font-medium px-2 py-1 ${getLanguageColor(
                repository.language
              )}`}
            >
              {repository.language}
            </Badge>
          )}
          {repository.private && (
            <Badge
              variant="outline"
              className="text-xs font-medium px-2 py-1 bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50"
            >
              Private
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Star className="h-3.5 w-3.5" />
              <span className="font-medium">{repository.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <GitFork className="h-3.5 w-3.5" />
              <span className="font-medium">{repository.forks_count}</span>
            </div>
            {repository.open_issues_count > 0 && (
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="font-medium">
                  {repository.open_issues_count}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Created {formatDate(repository.created_at)}</span>
          </div>
          <span className="text-right">
            Updated {formatDate(repository.updated_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
