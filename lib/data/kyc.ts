export type KycStatus = "pending" | "in_progress" | "verified" | "rejected"

export interface KycStep {
  id: string
  title: string
  description: string
  completed: boolean
  status: "pending" | "complete" | "in_review"
}

export interface KycData {
  status: KycStatus
  steps: KycStep[]
  verifiedAt?: string
}

export const defaultKyc: KycData = {
  status: "in_progress",
  verifiedAt: undefined,
  steps: [
    { id: "personal", title: "Personal details", description: "Full name, DOB, nationality", completed: true, status: "complete" },
    { id: "id", title: "ID document", description: "Passport, driver's license or national ID", completed: true, status: "complete" },
    { id: "selfie", title: "Selfie verification", description: "Take a selfie holding your ID", completed: false, status: "pending" },
    { id: "address", title: "Address verification", description: "Utility bill or bank statement", completed: false, status: "pending" },
  ],
}
