"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  authRefreshAction,
  loginUser,
  resetloginUser,
} from "../redux/authSlice";
import { useAppDispatch } from "../redux/redux/hooks";
import {
  loginData,
  loginError,
  loginIsError,
  loginIsLoading,
  loginIsSuccess,
  resetRefreshction,
} from "../redux/authSlice";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import Loader from "@/components/Loader";

export default function LoginPage() {
  const { isChecking } = useAuthRedirect({ redirectIfAuthenticated: true });
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const data = useSelector(loginData);
  const isLoading = useSelector(loginIsLoading);
  const isError = useSelector(loginIsError);
  const error = useSelector(loginError);
  const isSuccess = useSelector(loginIsSuccess);

  useEffect(() => {
    if (isSuccess) {
      console.log("isSuccessisSuccess", isSuccess);
      localStorage.setItem("token", data?.access_token);
      localStorage.setItem("sessionId", data?.session_state);
      localStorage.setItem("refresh_token", data?.refresh_token);
      dispatch(resetloginUser());

      toast.success("Login successful!");
      router.push("/dashboard");
    }

    if (isError) {
      toast.error(error || "Login failed.");
      dispatch(resetloginUser());
    }
  }, [dispatch, isSuccess, isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { email, password };
    dispatch(loginUser(payload));
  };

  if (isChecking) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg border-border/30">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
