"use client";

import { useState, useEffect } from "react";
import { Github, Key, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { connectTokenAction } from "@/app/redux/features/connecttokenSlice";
import { useAppDispatch } from "@/app/redux/redux/hooks";
import { useSelector } from "react-redux";

export function GitHubConnect() {
  const [githubToken, setGithubToken] = useState(""); // Only stored in memory
  const [hasToken, setHasToken] = useState(false);
  const dispatch = useAppDispatch();
  const [tokenInput, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { connectToken } = useSelector((state: any) => state.tokenres);

  // Check for existing connection status on component mount
  useEffect(() => {
    const isConnected = localStorage.getItem("github_connected");
    if (isConnected === "true") {
      setHasToken(true);
      // Note: Token is not restored from localStorage for security
    }
  }, []);

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim()) return;

    setIsLoading(true);

    // Simulate API validation (replace with actual GitHub API call)
    try {
      dispatch(connectTokenAction({ token: tokenInput }));

      setTimeout(() => {
        setGithubToken(tokenInput); // Store only in memory
        setHasToken(true);
        // Only store connection status flag, not the token
        localStorage.setItem("github_connected", "true");
        setTokenInput("");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error("Token validation failed:", error);
    }
  };

  const handleTokenDisconnect = () => {
    setGithubToken(""); // Clear from memory
    setHasToken(false);
    // Set connection flag to false
    localStorage.setItem("github_connected", "false");
  };

  const handleUpdateToken = () => {
    setHasToken(false);
    setGithubToken(""); // Clear from memory
    setTokenInput("");
    // Set connection flag to false since we're updating
    localStorage.setItem("github_connected", "false");
  };

  return (
    <>
      <DialogDescription className="text-sm text-gray-600">
        {hasToken
          ? "Your GitHub account is successfully connected. Manage your connection below."
          : "Connect your GitHub account to access private repositories and enhanced features."}
      </DialogDescription>

      {hasToken ? (
        // Connected State
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">
                Successfully Connected
              </p>
              <p className="text-xs text-emerald-600">
                Your GitHub token is active and ready to use
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleUpdateToken}
              className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Update Token
            </Button>
            <Button
              variant="destructive"
              onClick={handleTokenDisconnect}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </DialogFooter>
        </div>
      ) : (
        // Disconnected State
        <div className="space-y-4">
          <div className="space-y-3">
            <Label
              htmlFor="github-token"
              className="text-sm font-medium text-gray-700"
            >
              Personal Access Token
            </Label>
            <Input
              id="github-token"
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleTokenSubmit()}
            />
            <div className="bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700 rounded-md p-3">
              <p className="text-xs text-blue-700 dark:text-blue-100 leading-relaxed">
                <strong>How to get your token:</strong>
                <br />
                1. Go to GitHub Settings → Developer settings
                <br />
                2. Click "Personal access tokens" → "Tokens (classic)"
                <br />
                3. Generate new token with appropriate permissions
              </p>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            {/* <Button
              variant="outline"
              className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
              disabled={isLoading}
            >
              Cancel
            </Button> */}
            <Button
              onClick={handleTokenSubmit}
              disabled={!tokenInput.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      )}
    </>
  );
}
