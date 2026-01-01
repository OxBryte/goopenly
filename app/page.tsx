"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  // Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#003e91]/40 border-t-[#003e91] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });

      if (response.status === 201) {
        // Auto sign in after signup
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push(callbackUrl);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to create account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-card border border-border rounded-xl p-1.5 flex gap-1">
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                }}
                className={`px-8 py-2 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "signup"
                    ? "bg-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setError("");
                }}
                className={`px-8 py-2 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === "signin"
                    ? "bg-primary text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <form
              onSubmit={activeTab === "signup" ? handleSignUp : handleSignIn}
              className="space-y-4"
            >
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  {error}
                </div>
              )}

              {activeTab === "signup" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                {activeTab === "signup" && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : activeTab === "signup"
                  ? "Sign Up"
                  : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
