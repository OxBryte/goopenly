"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

export function WalletConnectButton() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          setConnectedAddress(accounts[0]);
          setIsOpen(false);
          // You can store the address in localStorage or send to your backend
          localStorage.setItem("walletAddress", accounts[0]);
        }
      } else {
        // MetaMask not installed - show install prompt
        alert(
          "MetaMask is not installed. Please install MetaMask to connect your wallet."
        );
        window.open("https://metamask.io/download/", "_blank");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        alert("Please connect to MetaMask.");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
    localStorage.removeItem("walletAddress");
    setIsOpen(false);
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("walletAddress");
      if (savedAddress) {
        setConnectedAddress(savedAddress);
      }
    }
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-muted relative"
        onClick={() => setIsOpen(true)}
        aria-label="Wallet"
      >
        <Wallet className="h-5 w-5" />
        {connectedAddress && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-background" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Connect your wallet to receive payments and manage your funds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {connectedAddress ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Connected Wallet
                  </p>
                  <p className="font-mono text-sm break-all">
                    {connectedAddress.slice(0, 6)}...
                    {connectedAddress.slice(-4)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <span className="mr-2">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
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
                    className="text-primary hover:underline"
                  >
                    Install it here
                  </a>
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

