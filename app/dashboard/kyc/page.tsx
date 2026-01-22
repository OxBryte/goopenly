"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileCheck,
  IdCard,
  MapPin,
  Camera,
  Shield,
  Loader2,
} from "lucide-react"
import { defaultKyc, type KycStep } from "@/lib/data/kyc"
import { Button } from "@/components/ui/button"

const stepIcons: Record<string, React.ElementType> = {
  personal: IdCard,
  id: FileCheck,
  selfie: Camera,
  address: MapPin,
}

export default function KycPage() {
  const [mounted, setMounted] = useState(false)
  const [kyc, setKyc] = useState(defaultKyc)
  const [submitting, setSubmitting] = useState(false)
  const [activeStep, setActiveStep] = useState<string | null>("selfie")

  useEffect(() => {
    setMounted(true)
  }, [])

  const completedCount = kyc.steps.filter((s) => s.completed).length
  const progress = (completedCount / kyc.steps.length) * 100

  const handleVerifyStep = (stepId: string) => {
    setActiveStep(stepId)
    setSubmitting(true)
    // Simulate verification
    setTimeout(() => {
      setKyc((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, completed: true, status: "complete" as const } : s
        ),
        status: prev.steps.filter((s) => s.id === stepId)[0]
          ? prev.steps.every((s) => s.id === stepId || s.completed)
            ? "verified"
            : "in_progress"
          : prev.status,
      }))
      setSubmitting(false)
      setActiveStep(null)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative overflow-hidden pb-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-pink-50/30 animate-pulse" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative max-w-2xl mx-auto px-6 py-6">
        <header
          className={`flex items-center gap-4 mb-6 ${mounted ? "animate-slide-down" : "opacity-0"}`}
        >
          <Link
            href="/dashboard/profile"
            className="p-2 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">KYC Verification</h1>
            <p className="text-sm text-gray-500">
              {kyc.status === "verified"
                ? "Identity verified"
                : `${completedCount} of ${kyc.steps.length} steps complete`}
            </p>
          </div>
        </header>

        {/* Status badge */}
        <div
          className={`mb-6 ${mounted ? "animate-slide-down delay-100" : "opacity-0"}`}
        >
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl border ${
              kyc.status === "verified"
                ? "bg-green-50 border-green-200"
                : kyc.status === "rejected"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl ${
                kyc.status === "verified"
                  ? "bg-green-100 text-green-600"
                  : kyc.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {kyc.status === "verified"
                  ? "Verified"
                  : kyc.status === "rejected"
                  ? "Verification failed"
                  : "Verification in progress"}
              </p>
              <p className="text-sm text-gray-600">
                {kyc.status === "verified"
                  ? "Your identity has been verified."
                  : kyc.status === "rejected"
                  ? "Please resubmit your documents."
                  : "Complete all steps to verify your identity."}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {kyc.status !== "verified" && (
          <div
            className={`mb-6 ${mounted ? "animate-slide-down delay-150" : "opacity-0"}`}
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Steps */}
        <div
          className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${mounted ? "animate-slide-down delay-200" : "opacity-0"}`}
        >
          <div className="divide-y divide-gray-100">
            {kyc.steps.map((step, index) => {
              const Icon = stepIcons[step.id] ?? Circle
              const isActive = activeStep === step.id
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 ${!step.completed ? "hover:bg-gray-50" : ""} transition-colors`}
                >
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      step.completed
                        ? "bg-green-50 text-green-600"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isActive && submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {step.completed ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      Done
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleVerifyStep(step.id)}
                      disabled={submitting}
                      className="flex-shrink-0"
                    >
                      {isActive && submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Info */}
        <p className={`mt-4 text-xs text-gray-500 text-center ${mounted ? "animate-slide-down delay-300" : "opacity-0"}`}>
          Your documents are encrypted and stored securely. Verification usually takes 1–2 business days.
        </p>
      </div>
    </div>
  )
}
