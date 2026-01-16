"use client";

import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const displayBalance = "0.00";

  return (
    <div className="w-full mx-auto">
      {/* Account Balance Section */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <div className="flex items-top justify-start gap-4 mb-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground tracking-wider mb-2">
              ACCOUNT BALANCE:
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl font-bold text-foreground">
                {isBalanceVisible ? `$${displayBalance}` : "••••••"}
              </div>
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Toggle balance visibility"
              >
                {isBalanceVisible ? (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Send Button */}
          <Button className="w-fit bg-foreground text-background hover:bg-foreground/90 h-11 rounded-full">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Send
          </Button>

          {/* Withdraw Button */}
          <Button
            variant="outline"
            className="w-fit border-border h-11 rounded-full"
          >
            Withdraw
          </Button>

          {/* More Options Button */}
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-full border-border"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
