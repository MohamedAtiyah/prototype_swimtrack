"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApp, SubscriptionPlan } from "@/lib/app-context"
import {
  Waves,
  ArrowLeft,
  Check,
  Crown,
  Zap,
  Users,
  Shield,
  Sparkles,
  Trophy,
  BarChart3,
  Target,
  LineChart,
  Infinity,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: SubscriptionPlan
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  icon: typeof Zap
  popular?: boolean
  features: PlanFeature[]
}

// Swimmer Plans
const swimmerPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started with basic tracking",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: [
      { text: "Limited swim logs (10/month)", included: true },
      { text: "Basic performance tracking", included: true },
      { text: "7-day history", included: true },
      { text: "Unlimited logging", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Goal tracking", included: false },
      { text: "Deep progress insights", included: false },
    ],
  },
  {
    id: "pro",
    name: "Swimmer Premium",
    description: "Unlock your full potential",
    monthlyPrice: 4.99,
    yearlyPrice: 39.99,
    icon: Crown,
    popular: true,
    features: [
      { text: "Unlimited swim logging", included: true },
      { text: "Advanced performance analytics", included: true },
      { text: "Goal tracking & milestones", included: true },
      { text: "Deep progress insights", included: true },
      { text: "Personal best tracking", included: true },
      { text: "Training recommendations", included: true },
      { text: "Export data & reports", included: true },
    ],
  },
]

// Parent Plans
const parentPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Monitor one child's progress",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: [
      { text: "Manage 1 child", included: true },
      { text: "Basic progress viewing", included: true },
      { text: "7-day history", included: true },
      { text: "Multiple children", included: false },
      { text: "Detailed reports", included: false },
      { text: "Milestone notifications", included: false },
      { text: "Coach profile sharing", included: false },
    ],
  },
  {
    id: "pro",
    name: "Family Plan",
    description: "Complete family swimming hub",
    monthlyPrice: 7.99,
    yearlyPrice: 69.99,
    icon: Users,
    popular: true,
    features: [
      { text: "Manage multiple children", included: true },
      { text: "Detailed progress reports", included: true },
      { text: "Milestone notifications", included: true },
      { text: "Share profiles with coaches", included: true },
      { text: "Performance comparisons", included: true },
      { text: "Goal setting for kids", included: true },
      { text: "Priority support", included: true },
    ],
  },
]

// Coach Plans
const coachPlans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Try with a small group",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: Zap,
    features: [
      { text: "Manage up to 3 swimmers", included: true },
      { text: "Basic athlete tracking", included: true },
      { text: "Limited history", included: true },
      { text: "Unlimited swimmers", included: false },
      { text: "Team dashboard", included: false },
      { text: "Performance comparisons", included: false },
      { text: "Training tools", included: false },
    ],
  },
  {
    id: "team",
    name: "Professional",
    description: "Full coaching toolkit",
    monthlyPrice: 14.99,
    yearlyPrice: 129.99,
    icon: Trophy,
    popular: true,
    features: [
      { text: "Unlimited swimmer management", included: true },
      { text: "Team dashboard & analytics", included: true },
      { text: "Performance comparisons", included: true },
      { text: "Training plan builder", included: true },
      { text: "Advanced reporting", included: true },
      { text: "Competition tracking", included: true },
      { text: "Parent communication tools", included: true },
    ],
  },
]

export function Pricing() {
  const { setCurrentView, user, setUser } = useApp()
  const [isYearly, setIsYearly] = useState(true)
  const [selectedTab, setSelectedTab] = useState<string>(user?.role || "swimmer")

  const handleSelectPlan = (plan: Plan) => {
    if (user) {
      setUser({
        ...user,
        subscription: plan.id,
      })
    }
    setCurrentView("dashboard")
  }

  const calculateSavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0
    const yearlySavings = plan.monthlyPrice * 12 - plan.yearlyPrice
    return Math.round((yearlySavings / (plan.monthlyPrice * 12)) * 100)
  }

  const renderPlanCard = (plan: Plan) => {
    const Icon = plan.icon
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
    const savings = calculateSavings(plan)
    const isCurrentPlan = user?.subscription === plan.id

    return (
      <Card
        key={plan.id}
        className={cn(
          "relative overflow-hidden transition-all border-0 shadow-sm press-scale",
          plan.popular && "shadow-lg shadow-primary/10 ring-2 ring-primary"
        )}
      >
        {plan.popular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-bl-xl">
            Recommended
          </div>
        )}
        <CardHeader className="pb-2 pt-5">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                plan.popular
                  ? "bg-gradient-to-br from-primary to-secondary"
                  : "bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "w-7 h-7",
                  plan.popular
                    ? "text-primary-foreground"
                    : "text-foreground"
                )}
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums">
                ${price.toFixed(2)}
              </span>
              <span className="text-muted-foreground">
                /{isYearly ? "year" : "month"}
              </span>
            </div>
            {isYearly && savings > 0 && (
              <p className="text-sm text-green-600 font-medium">
                Save {savings}% with yearly billing
              </p>
            )}
            {isYearly && plan.monthlyPrice > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Just ${(plan.yearlyPrice / 12).toFixed(2)}/month
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2.5 mb-5">
            {plan.features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2.5 text-sm",
                  !feature.included && "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                    feature.included
                      ? "bg-green-500/10 text-green-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Check className="w-3 h-3" />
                </div>
                <span className={cn(!feature.included && "line-through")}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            className="w-full h-12 font-semibold press-scale"
            variant={plan.popular ? "default" : "outline"}
            disabled={isCurrentPlan}
            onClick={() => handleSelectPlan(plan)}
          >
            {isCurrentPlan
              ? "Current Plan"
              : plan.id === "free"
              ? "Get Started"
              : "Start 7-Day Free Trial"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent pt-[calc(env(safe-area-inset-top)+0.5rem)] px-4 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 w-11 h-11 rounded-2xl press-scale"
            onClick={() => setCurrentView("dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-primary-foreground text-lg">
              SwimTrack
            </span>
          </div>
        </div>

        <div className="text-center text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-primary-foreground/80 text-sm">
            Unlock your full swimming potential
          </p>
        </div>

        {/* Billing Toggle - iOS segmented control style */}
        <div className="flex items-center justify-center gap-3 mt-6 bg-primary-foreground/10 rounded-full p-1 mx-auto w-fit">
          <button
            className={cn(
              "text-sm px-4 py-2 rounded-full transition-all font-medium",
              !isYearly
                ? "bg-primary-foreground text-primary"
                : "text-primary-foreground/70"
            )}
            onClick={() => setIsYearly(false)}
          >
            Monthly
          </button>
          <button
            className={cn(
              "text-sm px-4 py-2 rounded-full transition-all font-medium flex items-center gap-1.5",
              isYearly
                ? "bg-primary-foreground text-primary"
                : "text-primary-foreground/70"
            )}
            onClick={() => setIsYearly(true)}
          >
            Yearly
            <Badge className="bg-green-500 text-white text-[10px] border-0 px-1.5 py-0.5">
              -33%
            </Badge>
          </button>
        </div>
      </div>

      {/* Role Tabs & Plans */}
      <div className="px-4 -mt-4 pb-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4 h-12 p-1">
            <TabsTrigger value="swimmer" className="flex items-center gap-1.5 h-10 rounded-lg">
              <Waves className="w-4 h-4" />
              <span className="hidden sm:inline">Swimmer</span>
            </TabsTrigger>
            <TabsTrigger value="parent" className="flex items-center gap-1.5 h-10 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Parent</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-1.5 h-10 rounded-lg">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Coach</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="swimmer" className="space-y-4 mt-0">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Track your swims, analyze performance, and reach your goals
              </p>
            </div>
            {swimmerPlans.map(renderPlanCard)}
          </TabsContent>

          <TabsContent value="parent" className="space-y-4 mt-0">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Monitor your children&apos;s progress and celebrate milestones
              </p>
            </div>
            {parentPlans.map(renderPlanCard)}
          </TabsContent>

          <TabsContent value="coach" className="space-y-4 mt-0">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Manage your team, track athletes, and build training plans
              </p>
            </div>
            {coachPlans.map(renderPlanCard)}
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="mt-6 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Why Upgrade?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Advanced Analytics</p>
                  <p className="text-xs text-muted-foreground">Deep insights</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Goal Tracking</p>
                  <p className="text-xs text-muted-foreground">Achieve targets</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Infinity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Unlimited Logs</p>
                  <p className="text-xs text-muted-foreground">No restrictions</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <LineChart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Progress Reports</p>
                  <p className="text-xs text-muted-foreground">Export data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 py-6 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure payment</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>7-day free trial</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  )
}
