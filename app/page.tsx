"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Wallet, Lock, User, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [step, setStep] = useState<"wallet" | "credentials">("wallet");
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

  // Check if wallet is already connected on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("walletAddress");
      if (savedAddress) {
        setWalletAddress(savedAddress);
        setStep("credentials");
      }
    }
  }, []);

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

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    setError("");

    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem("walletAddress", accounts[0]);
          setStep("credentials");
        }
      } else {
        // MetaMask not installed - show install prompt
        setError("MetaMask is not installed. Please install MetaMask to continue.");
        setTimeout(() => {
          window.open("https://metamask.io/download/", "_blank");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setError("Please connect to MetaMask to continue.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate wallet is connected
    if (!walletAddress) {
      setError("Please connect your wallet first");
      setIsLoading(false);
      return;
    }

    // Validate inputs
    if (!username.trim()) {
      setError("Username is required");
      setIsLoading(false);
      return;
    }

    if (!pin || pin.length < 4) {
      setError("PIN must be at least 4 digits");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        username,
        pin,
        walletAddress,
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

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <h1 className="text-4xl font-bold text-foreground mb-2">Openly</h1>
            <p className="text-muted-foreground">Web3 Payments Platform</p>
          </div>

          {/* Main Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-6 gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step === "wallet" || walletAddress
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {walletAddress ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Wallet className="w-5 h-5" />
                )}
              </div>
              <div className="h-0.5 w-12 bg-border"></div>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step === "credentials" && walletAddress
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Wallet Connection Step */}
            {step === "wallet" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Connect Your Wallet
                  </h2>
                  <p className="text-muted-foreground">
                    Connect your MetaMask wallet to get started
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive animate-in fade-in duration-300">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isConnectingWallet ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect MetaMask
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Don't have MetaMask?{" "}
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Install it here
                  </a>
                </p>
              </div>
            )}

            {/* Login Credentials Step */}
            {step === "credentials" && walletAddress && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    Welcome Back
                  </h2>
                  <p className="text-muted-foreground">
                    Enter your credentials to continue
                  </p>
                </div>

                {/* Connected Wallet Display */}
                <div className="p-4 bg-accent/50 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">
                        Wallet Connected
                      </span>
                    </div>
                    <span className="font-mono text-sm text-foreground">
                      {formatWalletAddress(walletAddress)}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive animate-in fade-in duration-300">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                      }}
                      required
                      disabled={isLoading}
                      className="h-11"
                      autoComplete="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pin" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      PIN
                    </Label>
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Enter your PIN"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setError("");
                      }}
                      required
                      minLength={4}
                      maxLength={6}
                      disabled={isLoading}
                      className="h-11"
                      autoComplete="current-password"
                      inputMode="numeric"
                    />
                    <p className="text-xs text-muted-foreground">
                      4-6 digit PIN required
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base"
                    disabled={isLoading || !username.trim() || pin.length < 4}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <button
                  onClick={() => {
                    setStep("wallet");
                    setError("");
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors w-full text-center"
                >
                  ← Use a different wallet
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-1000 delay-300">
            <p>Secure login powered by Web3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
