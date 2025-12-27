"use client";

import React, { useState } from "react";
import { useCreatePaymentLink } from "@/lib/hooks/product/use-create-product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  Link,
  Copy,
  CheckCircle,
  X,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentLinkCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (paymentLink: any) => void;
}

interface PaymentLinkData {
  amount: string;
  currency: string;
  title: string;
  description: string;
  purpose: string;
  expiresIn: string;
  allowMultiplePayments: boolean;
}

export function PaymentLinkCreatorModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentLinkCreatorModalProps) {
  const {
    createPaymentLink,
    loading: isCreatingLink,
    error: createError,
  } = useCreatePaymentLink();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [formData, setFormData] = useState<PaymentLinkData>({
    amount: "",
    currency: "USD",
    title: "",
    description: "",
    purpose: "",
    expiresIn: "7",
    allowMultiplePayments: false,
  });

  const totalSteps = 4;

  const handleInputChange = (
    field: keyof PaymentLinkData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.amount && formData.currency;
      case 2:
        return formData.title;
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Settings
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        type: "product" as const,
        name: formData.title,
        description: formData.description,
        amount: formData.amount || "0",
        currency: formData.currency.toLowerCase(),
        purpose: formData.purpose || "product",
        expiresIn: formData.expiresIn,
        allowMultiplePayments: formData.allowMultiplePayments,
        payoutChain: "base-sepolia",
        payoutToken: "USDC",
        slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
      };

      const paymentLink = await createPaymentLink(payload);

      if (paymentLink) {
        setCreatedLink(paymentLink.paymentLink);
        toast.success("Payment link created successfully!");

        if (onSuccess) {
          onSuccess({
            link: paymentLink.paymentLink,
            id: paymentLink.id,
            slug: paymentLink.slug,
            ...formData,
          });
        }
      } else {
        toast.error(createError || "Failed to create payment link");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment link"
      );
      console.error("Error creating payment link:", error);
    }
  };

  const handleCopyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      toast.success("Payment link copied to clipboard!");
    }
  };

  const handleClose = () => {
    setCreatedLink(null);
    setCurrentStep(1);
    setFormData({
      amount: "",
      currency: "USD",
      title: "",
      description: "",
      purpose: "",
      expiresIn: "7",
      allowMultiplePayments: false,
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderAmountStep();
      case 2:
        return renderDetailsStep();
      case 3:
        return renderDescriptionStep();
      case 4:
        return renderSettingsStep();
      default:
        return null;
    }
  };

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Payment Amount</h3>
        <p className="text-sm sm:text-base text-muted-foreground">How much do you want to charge?</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground font-medium">
            Amount *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-foreground font-medium">
            Currency *
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleInputChange("currency", value)}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {currencyOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-success/20">
          <CreditCard className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Payment Details</h3>
        <p className="text-sm sm:text-base text-muted-foreground">What is this payment for?</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground font-medium">
            Payment Title *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Website Development, Consulting Session"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose" className="text-foreground font-medium">
            Purpose
          </Label>
          <Select
            value={formData.purpose}
            onValueChange={(value) => handleInputChange("purpose", value)}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {purposeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderDescriptionStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
          <Link className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Description</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          Add more details about this payment (optional)
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what this payment is for, any special instructions, or additional details..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary min-h-[120px]"
            rows={4}
          />
        </div>
      </div>
    </div>
  );

  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/20">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Payment Settings</h3>
        <p className="text-sm sm:text-base text-muted-foreground">Configure your payment link</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expiresIn" className="text-foreground font-medium">
            Expires In
          </Label>
          <Select
            value={formData.expiresIn}
            onValueChange={(value) => handleInputChange("expiresIn", value)}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {expiresOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-foreground"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Payment Options</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
              <input
                type="checkbox"
                id="allowMultiple"
                checked={formData.allowMultiplePayments}
                onChange={(e) =>
                  handleInputChange("allowMultiplePayments", e.target.checked)
                }
                className="rounded border-border bg-background text-primary focus:ring-primary"
              />
              <div>
                <Label
                  htmlFor="allowMultiple"
                  className="text-foreground font-medium"
                >
                  Allow multiple payments
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let customers pay multiple times with the same link
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const currencyOptions = [
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
  ];

  const purposeOptions = [
    { value: "service", label: "Service Payment" },
    { value: "product", label: "Product Purchase" },
    { value: "donation", label: "Donation" },
    { value: "subscription", label: "Subscription" },
    { value: "event", label: "Event Registration" },
    { value: "consultation", label: "Consultation" },
    { value: "other", label: "Other" },
  ];

  const expiresOptions = [
    { value: "1", label: "1 day" },
    { value: "3", label: "3 days" },
    { value: "7", label: "1 week" },
    { value: "14", label: "2 weeks" },
    { value: "30", label: "1 month" },
    { value: "90", label: "3 months" },
    { value: "never", label: "Never expires" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full mx-2 sm:mx-auto bg-background backdrop-blur-lg border border-border text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            Create Payment Link
          </DialogTitle>

          {/* Progress Indicator */}
          {!createdLink && (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-3 sm:mt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                    i + 1 <= currentStep
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1 < currentStep ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : i + 1}
                </div>
              ))}
            </div>
          )}
        </DialogHeader>

        {!createdLink ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Error Message */}
            {createError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{createError}</p>
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-border">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="border-border text-foreground hover:bg-muted disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isCreatingLink}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto min-h-[44px]"
                >
                  {isCreatingLink ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Link...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Create Payment Link
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 w-full sm:w-auto min-h-[44px]"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                Payment Link Created!
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your payment link is ready to share
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 sm:p-4 border border-border">
              <Label className="text-foreground font-medium mb-2 block text-sm sm:text-base">
                Payment Link
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={createdLink}
                  readOnly
                  className="bg-background border-border text-foreground font-mono text-xs sm:text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px] sm:min-h-0"
                >
                  <Copy className="w-4 h-4 mr-2 sm:mr-0" />
                  <span className="sm:hidden">Copy Link</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Amount</p>
                <p className="text-foreground font-semibold text-sm sm:text-base">
                  {formData.currency} {formData.amount}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs sm:text-sm">Purpose</p>
                <p className="text-foreground font-semibold text-sm sm:text-base">
                  {formData.purpose || "General"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleClose}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]"
              >
                Done
              </Button>
              <Button
                onClick={() => setCreatedLink(null)}
                variant="outline"
                className="flex-1 border-border text-foreground hover:bg-muted min-h-[44px]"
              >
                Create Another
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
