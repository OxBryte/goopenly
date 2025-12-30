"use client";

import { useState, useEffect } from "react";
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
  TrendingUp,
} from "lucide-react";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  popular?: boolean;
  gradient: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started",
    icon: Sparkles,
    gradient: "from-gray-500 to-gray-600",
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
    gradient: "from-primary to-primary/80",
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
    gradient: "from-yellow-500 to-orange-500",
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
  const [savings] = useState(() => Math.random() * 500 + 100);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Animate savings counter on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = savings / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= savings) {
        setAnimatedValue(savings);
        clearInterval(timer);
      } else {
        setAnimatedValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [savings]);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      // Handle free plan selection
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(planId);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // Here you would integrate with your payment processor
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
        {/* Hero Section with Unique Savings Counter */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Choose Your Plan
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Start free, upgrade as you grow. All plans include our core
              features.
            </p>
          </motion.div>

          {/* Unique Savings Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full border border-primary/20"
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold text-primary">
                ${animatedValue.toFixed(2)}
              </p>
            </div>
            <div className="text-left ml-4 pl-4 border-l border-primary/20">
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-sm font-semibold text-foreground">
                vs Traditional Processors
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards with Unique Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {isPopular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
                      Most Popular
                    </Badge>
                  </motion.div>
                )}

                <Card
                  className={`h-full flex flex-col border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                    isPopular
                      ? "border-primary shadow-md"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <motion.div
                    className={`h-2 bg-gradient-to-r ${plan.gradient} rounded-t-lg`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                  />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Plan Header */}
                    <div className="mb-6">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.description}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          {plan.price}
                        </span>
                        {plan.period !== "forever" &&
                          plan.period !== "pricing" && (
                            <span className="text-muted-foreground">
                              /{plan.period}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="flex-1 space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0">
                            <Check className="h-4 w-4 text-primary" />
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
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Compare Plans
            </h3>
            <p className="text-muted-foreground">
              See what's included in each plan
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">
                      Features
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground">
                      Starter
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground bg-primary/5">
                      Professional
                    </th>
                    <th className="text-center p-4 font-semibold text-foreground">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
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
                  <tr>
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
                  <tr>
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
                  <tr>
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
                  <tr>
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
                  <tr>
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
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Card key={index} className="p-6">
                <h4 className="font-semibold text-foreground mb-2">
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
