"use client"

import { useClerk } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useApp } from "@/lib/app-context"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Crown,
  ChevronRight,
  LogOut,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  Calendar,
  CheckCircle,
} from "lucide-react"

export function ProfileManagement() {
  const { signOut } = useClerk()
  const { setCurrentView, user, setUser } = useApp()

  const handleLogout = () => {
    setUser(null)
    setCurrentView("dashboard")
    void signOut({ redirectUrl: "/onboarding" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getPlanDetails = () => {
    switch (user?.subscription) {
      case "pro":
        return {
          name: "Pro Plan",
          price: "$9.99/month",
          color: "bg-gradient-to-br from-primary to-secondary",
          renewDate: "April 28, 2026",
        }
      case "team":
        return {
          name: "Team Plan",
          price: "$29.99/month",
          color: "bg-gradient-to-br from-secondary to-accent",
          renewDate: "April 28, 2026",
        }
      default:
        return {
          name: "Free Plan",
          price: "Free",
          color: "bg-muted",
          renewDate: null,
        }
    }
  }

  const planDetails = getPlanDetails()

  const menuItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Password, 2FA, and privacy settings",
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Units, language, and display preferences",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "FAQs, contact support, and feedback",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-28 scroll-bounce">
      {/* Header with safe area */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-[calc(env(safe-area-inset-top)+0.5rem)] px-4 pb-24">
        <div className="flex items-center gap-4 mb-4">
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
              Profile
            </span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-16">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-semibold">
                  {user ? getInitials(user.name) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <Badge className="mt-1.5 capitalize">{user?.role}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium ml-auto">{user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium ml-auto text-right truncate max-w-[180px]">{user?.email}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 h-12 font-medium press-scale"
              onClick={() => setCurrentView("edit-profile")}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Card */}
      <div className="px-4 mt-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Subscription
              </CardTitle>
              {user?.subscription !== "free" && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${planDetails.color}`}
              >
                <Crown
                  className={`w-7 h-7 ${
                    user?.subscription === "free"
                      ? "text-muted-foreground"
                      : "text-primary-foreground"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{planDetails.name}</p>
                <p className="text-sm text-muted-foreground">
                  {planDetails.price}
                </p>
              </div>
            </div>

            {planDetails.renewDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-xl">
                <Calendar className="w-4 h-4" />
                <span>Next billing: {planDetails.renewDate}</span>
              </div>
            )}

            <div className="flex gap-2">
              {user?.subscription === "free" ? (
                <Button
                  className="flex-1 h-12 font-medium press-scale"
                  onClick={() => setCurrentView("pricing")}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 h-11 press-scale"
                    onClick={() => setCurrentView("pricing")}
                  >
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1 h-11 press-scale">
                    Manage Billing
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items - iOS style list */}
      <div className="px-4 mt-4">
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index}>
                  <button className="list-item-ios w-full text-left">
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                  </button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4 mb-6">
        <Button
          variant="outline"
          className="w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium press-scale"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
