"use client";

import { useState } from "react";
import DashboardPageLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";
import { BarChart3 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    features: [
      "Up to 10 products",
      "Basic analytics",
      "Email support",
      "Standard payment processing",
      "1 payment link",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    price: "$29",
    period: "month",
    description: "For growing businesses",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Fast payment processing",
      "Unlimited payment links",
      "Custom branding",
      "API access",
      "Webhook integrations",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large scale operations",
    icon: Crown,
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
      "Multi-user access",
      "Custom reporting",
      "White-label solution",
    ],
  },
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    setTimeout(() => {
      setIsProcessing(false);
      console.log(`Selected plan: ${planId}`);
    }, 1000);
  };

  return (
    <DashboardPageLayout
      header={{
        title: "Subscription",
        description: "Choose the perfect plan for your business",
        icon: BarChart3,
      }}
    >
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade as you grow. All plans include our core features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`h-full flex flex-col border transition-all hover:shadow-md ${
                    isPopular
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        {plan.period !== "forever" &&
                          plan.period !== "pricing" && (
                            <span className="text-muted-foreground text-sm">
                              /{plan.period}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex-1 space-y-2.5 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <div className="mt-0.5 flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isProcessing && selectedPlan === plan.id}
                      className={`w-full ${
                        isPopular
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      }`}
                      variant={isPopular ? "default" : "secondary"}
                    >
                      {isProcessing && selectedPlan === plan.id ? (
                        "Processing..."
                      ) : plan.id === "free" ? (
                        "Get Started"
                      ) : plan.id === "enterprise" ? (
                        <>
                          Contact Sales
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Upgrade Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Compare Plans
            </h3>
            <p className="text-muted-foreground">
              See what's included in each plan
            </p>
          </div>

          <Card className="overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-foreground">
                      Features
                    </th>
                    <th className="text-center p-4 font-medium text-foreground">
                      Starter
                    </th>
                    <th className="text-center p-4 font-medium text-foreground bg-primary/5">
                      Professional
                    </th>
                    <th className="text-center p-4 font-medium text-foreground">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">Products</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      Up to 10
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      Unlimited
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Unlimited
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">
                      Payment Links
                    </td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      1
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      Unlimited
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Unlimited
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">Analytics</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      Basic
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      Advanced
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Custom
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">Support</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      Email
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      Priority
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      Dedicated
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">API Access</td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      —
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm text-foreground">
                      Custom Branding
                    </td>
                    <td className="p-4 text-center text-sm text-muted-foreground">
                      —
                    </td>
                    <td className="p-4 text-center text-sm text-foreground bg-primary/5">
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    </td>
                    <td className="p-4 text-center text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, debit cards, and cryptocurrency payments.",
              },
              {
                question: "Is there a setup fee?",
                answer:
                  "No, there are no setup fees. You only pay for the plan you choose.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "Yes, we offer a 30-day money-back guarantee on all paid plans.",
              },
            ].map((faq, index) => (
              <Card key={index} className="p-5 border hover:border-primary/30 transition-colors">
                <h4 className="font-medium text-foreground mb-2">
                  {faq.question}
                </h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
