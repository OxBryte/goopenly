"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: "success" | "error"
  title: string
  message: string
  buttonLabel?: string
}

export function SuccessModal({
  open,
  onOpenChange,
  variant = "success",
  title,
  message,
  buttonLabel = "Done",
}: SuccessModalProps) {
  const isError = variant === "error"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center py-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isError ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {isError ? (
              <XCircle className="w-8 h-8 text-red-600" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 mt-2">{message}</p>
          <Button
            className="mt-6 w-full"
            onClick={() => onOpenChange(false)}
          >
            {buttonLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
