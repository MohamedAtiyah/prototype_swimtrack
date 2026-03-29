"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Waves,
  User,
  Mail,
  ChevronRight,
} from "lucide-react"
import { useApp, UserRole } from "@/lib/app-context"
import { completeOnboardingAction } from "@/lib/actions/app-data"

interface AccountSetupProps {
  role: UserRole
}

export function AccountSetup({ role }: AccountSetupProps) {
  const {
    setUser,
    setCurrentView,
    setSelectedChild,
    setSelectedAthlete,
  } = useApp()
  const { user: clerkUser, isSignedIn } = useUser()
  const prefilled = useRef(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [childrenNames, setChildrenNames] = useState<string[]>([""])
  const [teamName, setTeamName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!clerkUser || prefilled.current) return
    setName(clerkUser.fullName || "")
    setEmail(clerkUser.primaryEmailAddress?.emailAddress || "")
    prefilled.current = true
  }, [clerkUser])

  const handleBack = () => {
    setCurrentView("onboarding")
  }

  const addChild = () => {
    if (childrenNames.length < 5) {
      setChildrenNames([...childrenNames, ""])
    }
  }

  const removeChild = (index: number) => {
    if (childrenNames.length > 1) {
      setChildrenNames(childrenNames.filter((_, i) => i !== index))
    }
  }

  const updateChildName = (index: number, value: string) => {
    const updated = [...childrenNames]
    updated[index] = value
    setChildrenNames(updated)
  }

  const handleSubmit = async () => {
    if (!role) return
    if (!isSignedIn) {
      toast.error("Sign in with the header buttons to save your SwimTrack profile.")
      return
    }

    const trimmedName = name.trim()
    let trimmedEmail = email.trim()
    if (!trimmedName) {
      toast.error("Please enter your name.")
      return
    }
    if (!trimmedEmail && clerkUser?.primaryEmailAddress?.emailAddress) {
      trimmedEmail = clerkUser.primaryEmailAddress.emailAddress
    }
    if (!trimmedEmail) {
      toast.error("Please enter your email.")
      return
    }

    if (role === "parent") {
      const kids = childrenNames.map((n) => n.trim()).filter(Boolean)
      if (kids.length === 0) {
        toast.error("Add at least one child name.")
        return
      }
    }

    setSubmitting(true)
    try {
      const result = await completeOnboardingAction({
        role,
        displayName: trimmedName,
        email: trimmedEmail,
        childrenNames: role === "parent" ? childrenNames : undefined,
        teamName: role === "coach" ? teamName : undefined,
      })

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      if (result.user) {
        setUser(result.user)
        if (result.user.role === "parent" && result.user.children?.[0]) {
          setSelectedChild(result.user.children[0])
        } else {
          setSelectedChild(null)
        }
        if (result.user.role === "coach" && result.user.athletes?.[0]) {
          setSelectedAthlete(result.user.athletes[0])
        } else {
          setSelectedAthlete(null)
        }
        setCurrentView("dashboard")
        toast.success("Profile saved.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case "swimmer":
        return "Set Up Your Profile"
      case "parent":
        return "Set Up Family Account"
      case "coach":
        return "Set Up Team Account"
      default:
        return "Set Up Account"
    }
  }

  const getRoleDescription = () => {
    switch (role) {
      case "swimmer":
        return "Enter your details to start tracking your swimming performance"
      case "parent":
        return "Add your children to monitor their swimming progress"
      case "coach":
        return "Set up your team to manage athletes and training"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset scroll-bounce">
      <div className="flex items-center gap-4 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="w-11 h-11 rounded-2xl press-scale"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Waves className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">SwimTrack</span>
        </div>
      </div>

      <div className="flex-1 p-5 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">{getRoleDescription()}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-13 border-0 bg-muted/50 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-13 border-0 bg-muted/50 text-base"
                />
              </div>
            </div>
          </div>

          {role === "parent" && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Children Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {childrenNames.map((childName, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Child ${index + 1} name`}
                      value={childName}
                      onChange={(e) => updateChildName(index, e.target.value)}
                      className="h-12 border-0 bg-muted/50 text-base"
                    />
                    {childrenNames.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChild(index)}
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 w-12 h-12 press-scale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {childrenNames.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                    className="w-full mt-2 h-11 font-medium press-scale"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Child
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {role === "coach" && (
            <div className="space-y-2">
              <Label htmlFor="team" className="text-sm font-medium">Team Name</Label>
              <Input
                id="team"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-13 border-0 bg-muted/50 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Add athletes from your dashboard after setup.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-2xl press-scale"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Get Started"}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
