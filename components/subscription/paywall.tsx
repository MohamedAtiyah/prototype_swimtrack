"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"
import {
  X,
  Crown,
  Check,
  Sparkles,
  TrendingUp,
  BarChart3,
  Infinity,
  Zap,
} from "lucide-react"

const premiumFeatures = [
  { icon: Infinity, text: "Unlimited swim logs" },
  { icon: BarChart3, text: "Advanced analytics & trends" },
  { icon: TrendingUp, text: "AI-powered coaching insights" },
  { icon: Sparkles, text: "Personalized recommendations" },
]

export function Paywall() {
  const { setShowPaywall, setCurrentView } = useApp()

  const handleUpgrade = () => {
    setShowPaywall(false)
    setCurrentView("pricing")
  }

  const handleClose = () => {
    setShowPaywall(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 mb-0 sm:mb-4 rounded-b-none sm:rounded-b-xl animate-in slide-in-from-bottom duration-300">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-10"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Blurred preview background */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <CardContent className="relative p-6 pt-12">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Crown className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Unlock Premium</h2>
            <p className="text-muted-foreground">
              Get access to advanced features and take your swimming to the next
              level
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              )
            })}
          </div>

          {/* Pricing teaser */}
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Starting at</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">$6.67</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-green-500 font-medium">
              Save 33% with yearly billing
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full h-12 text-lg font-semibold"
              onClick={handleUpgrade}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleClose}
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            7-day free trial. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
