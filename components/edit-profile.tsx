"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/lib/app-context"
import { updateProfileAction } from "@/lib/actions/app-data"
import { BottomNav } from "@/components/navigation/bottom-nav"
import {
  Waves,
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Users,
  Save,
  X,
  Plus,
  Trash2,
  Building2,
  Shield,
  CheckCircle2,
  AlertCircle,
  Flag,
} from "lucide-react"

type TeamType = "national" | "club" | "private" | "government"

interface Team {
  id: string
  type: TeamType
  name: string
}

interface SwimmerFields {
  birthDate: string
  primaryStroke: string
  secondaryStroke: string
  coachName: string
  goals: string
  teams: Team[]
}

interface ParentFields {
  phone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  notificationPreference: string
  // Child swimmer fields (similar to swimmer)
  childSwimmerFields: {
    childId: string
    birthDate: string
    primaryStroke: string
    secondaryStroke: string
    coachName: string
    goals: string
    teams: Team[]
  }[]
}

interface CoachFields {
  phone: string
  companyEmail: string
  isVerified: boolean
  verificationPending: boolean
  clubName: string
  certification: string
  yearsExperience: string
  specializations: string[]
  bio: string
}

export function EditProfile() {
  const { setCurrentView, user, setUser } = useApp()
  
  // Common fields
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  
  // Swimmer-specific fields
  const [swimmerFields, setSwimmerFields] = useState<SwimmerFields>({
    birthDate: "",
    primaryStroke: "",
    secondaryStroke: "",
    coachName: "",
    goals: "",
    teams: [],
  })
  
  // Parent-specific fields
  const [parentFields, setParentFields] = useState<ParentFields>({
    phone: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    notificationPreference: "all",
    childSwimmerFields: [],
  })
  
  // Coach-specific fields
  const [coachFields, setCoachFields] = useState<CoachFields>({
    phone: "",
    companyEmail: "",
    isVerified: false,
    verificationPending: false,
    clubName: "",
    certification: "",
    yearsExperience: "",
    specializations: [],
    bio: "",
  })
  
  const [newSpecialization, setNewSpecialization] = useState("")
  const [newTeam, setNewTeam] = useState<{ type: TeamType; name: string }>({ type: "club", name: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [selectedChildIndex, setSelectedChildIndex] = useState(0)

  useEffect(() => {
    if (user?.role !== "parent" || !user.children?.length) return
    setParentFields((p) => ({
      ...p,
      childSwimmerFields: user.children!.map((c) => ({
        childId: c.id,
        birthDate: "",
        primaryStroke: "",
        secondaryStroke: "",
        coachName: "",
        goals: "",
        teams: [],
      })),
    }))
  }, [user?.role, user?.children])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateProfileAction({
        displayName: name.trim(),
        email: email.trim(),
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (result.user) {
        setUser(result.user)
      }
      toast.success("Profile updated.")
      setCurrentView("profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerifyCoachEmail = async () => {
    if (!coachFields.companyEmail) return
    
    // Simulate sending verification email
    setCoachFields({
      ...coachFields,
      verificationPending: true,
    })
    
    // In real app, this would send a verification email
    setTimeout(() => {
      setCoachFields(prev => ({
        ...prev,
        isVerified: true,
        verificationPending: false,
      }))
    }, 2000)
  }

  const addSpecialization = () => {
    if (newSpecialization.trim() && !coachFields.specializations.includes(newSpecialization.trim())) {
      setCoachFields({
        ...coachFields,
        specializations: [...coachFields.specializations, newSpecialization.trim()],
      })
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (spec: string) => {
    setCoachFields({
      ...coachFields,
      specializations: coachFields.specializations.filter((s) => s !== spec),
    })
  }

  const addTeamToSwimmer = () => {
    if (newTeam.name.trim()) {
      const team: Team = {
        id: Date.now().toString(),
        type: newTeam.type,
        name: newTeam.name.trim(),
      }
      setSwimmerFields({
        ...swimmerFields,
        teams: [...swimmerFields.teams, team],
      })
      setNewTeam({ type: "club", name: "" })
    }
  }

  const removeTeamFromSwimmer = (teamId: string) => {
    setSwimmerFields({
      ...swimmerFields,
      teams: swimmerFields.teams.filter((t) => t.id !== teamId),
    })
  }

  const addTeamToChild = (childIndex: number) => {
    if (newTeam.name.trim()) {
      const team: Team = {
        id: Date.now().toString(),
        type: newTeam.type,
        name: newTeam.name.trim(),
      }
      const updatedChildren = [...parentFields.childSwimmerFields]
      updatedChildren[childIndex] = {
        ...updatedChildren[childIndex],
        teams: [...updatedChildren[childIndex].teams, team],
      }
      setParentFields({
        ...parentFields,
        childSwimmerFields: updatedChildren,
      })
      setNewTeam({ type: "club", name: "" })
    }
  }

  const removeTeamFromChild = (childIndex: number, teamId: string) => {
    const updatedChildren = [...parentFields.childSwimmerFields]
    updatedChildren[childIndex] = {
      ...updatedChildren[childIndex],
      teams: updatedChildren[childIndex].teams.filter((t) => t.id !== teamId),
    }
    setParentFields({
      ...parentFields,
      childSwimmerFields: updatedChildren,
    })
  }

  const getTeamTypeColor = (type: TeamType) => {
    switch (type) {
      case "national":
        return "bg-amber-500/10 text-amber-600 border-amber-500/30"
      case "club":
        return "bg-primary/10 text-primary border-primary/30"
      case "private":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30"
      case "government":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
    }
  }

  const getTeamTypeLabel = (type: TeamType) => {
    switch (type) {
      case "national":
        return "National Team"
      case "club":
        return "Club Team"
      case "private":
        return "Private Team"
      case "government":
        return "Government Team"
    }
  }

  const renderTeamSection = (teams: Team[], onAdd: () => void, onRemove: (id: string) => void) => (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Flag className="w-4 h-4 text-primary" />
        Teams Representing
      </Label>
      
      {teams.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <Badge
              key={team.id}
              variant="outline"
              className={`flex items-center gap-1.5 pr-1 ${getTeamTypeColor(team.type)}`}
            >
              <span className="text-xs opacity-70">{getTeamTypeLabel(team.type)}:</span>
              {team.name}
              <button
                type="button"
                onClick={() => onRemove(team.id)}
                className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <Select
          value={newTeam.type}
          onValueChange={(value: TeamType) => setNewTeam({ ...newTeam, type: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national">National</SelectItem>
            <SelectItem value="club">Club</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="government">Government</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          placeholder="Team name"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              onAdd()
            }
          }}
        />
        <Button type="button" variant="outline" size="icon" onClick={onAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  const renderSwimmerFields = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Swimmer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birth Date</Label>
          <Input
            id="birthDate"
            type="date"
            value={swimmerFields.birthDate}
            onChange={(e) =>
              setSwimmerFields({ ...swimmerFields, birthDate: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryStroke">Primary Stroke</Label>
            <Select
              value={swimmerFields.primaryStroke}
              onValueChange={(value) =>
                setSwimmerFields({ ...swimmerFields, primaryStroke: value })
              }
            >
              <SelectTrigger id="primaryStroke">
                <SelectValue placeholder="Select stroke" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freestyle">Freestyle</SelectItem>
                <SelectItem value="backstroke">Backstroke</SelectItem>
                <SelectItem value="breaststroke">Breaststroke</SelectItem>
                <SelectItem value="butterfly">Butterfly</SelectItem>
                <SelectItem value="im">Individual Medley</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryStroke">Secondary Stroke</Label>
            <Select
              value={swimmerFields.secondaryStroke}
              onValueChange={(value) =>
                setSwimmerFields({ ...swimmerFields, secondaryStroke: value })
              }
            >
              <SelectTrigger id="secondaryStroke">
                <SelectValue placeholder="Select stroke" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freestyle">Freestyle</SelectItem>
                <SelectItem value="backstroke">Backstroke</SelectItem>
                <SelectItem value="breaststroke">Breaststroke</SelectItem>
                <SelectItem value="butterfly">Butterfly</SelectItem>
                <SelectItem value="im">Individual Medley</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teams Section */}
        {renderTeamSection(
          swimmerFields.teams,
          addTeamToSwimmer,
          removeTeamFromSwimmer
        )}

        <div className="space-y-2">
          <Label htmlFor="coachName">Coach Name</Label>
          <Input
            id="coachName"
            value={swimmerFields.coachName}
            onChange={(e) =>
              setSwimmerFields({ ...swimmerFields, coachName: e.target.value })
            }
            placeholder="Your coach's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Swimming Goals</Label>
          <Textarea
            id="goals"
            value={swimmerFields.goals}
            onChange={(e) =>
              setSwimmerFields({ ...swimmerFields, goals: e.target.value })
            }
            placeholder="What are your swimming goals?"
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderParentFields = () => (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Parent Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={parentFields.phone}
                onChange={(e) =>
                  setParentFields({ ...parentFields, phone: e.target.value })
                }
                className="pl-10"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="address"
                value={parentFields.address}
                onChange={(e) =>
                  setParentFields({ ...parentFields, address: e.target.value })
                }
                className="pl-10"
                placeholder="Your address"
              />
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Emergency Contact
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={parentFields.emergencyContact}
                  onChange={(e) =>
                    setParentFields({
                      ...parentFields,
                      emergencyContact: e.target.value,
                    })
                  }
                  placeholder="Emergency contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={parentFields.emergencyPhone}
                  onChange={(e) =>
                    setParentFields({
                      ...parentFields,
                      emergencyPhone: e.target.value,
                    })
                  }
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifications">Notification Preference</Label>
            <Select
              value={parentFields.notificationPreference}
              onValueChange={(value) =>
                setParentFields({ ...parentFields, notificationPreference: value })
              }
            >
              <SelectTrigger id="notifications">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="important">Important Only</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Child Swimmer Profiles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            Child Swimmer Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Child Selector */}
          {parentFields.childSwimmerFields.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {parentFields.childSwimmerFields.map((child, index) => (
                <Button
                  key={child.childId}
                  variant={selectedChildIndex === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedChildIndex(index)}
                >
                  {user?.children?.[index]?.name || `Child ${index + 1}`}
                </Button>
              ))}
            </div>
          )}

          {parentFields.childSwimmerFields[selectedChildIndex] && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Birth Date</Label>
                <Input
                  type="date"
                  value={parentFields.childSwimmerFields[selectedChildIndex].birthDate}
                  onChange={(e) => {
                    const updated = [...parentFields.childSwimmerFields]
                    updated[selectedChildIndex] = {
                      ...updated[selectedChildIndex],
                      birthDate: e.target.value,
                    }
                    setParentFields({ ...parentFields, childSwimmerFields: updated })
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Stroke</Label>
                  <Select
                    value={parentFields.childSwimmerFields[selectedChildIndex].primaryStroke}
                    onValueChange={(value) => {
                      const updated = [...parentFields.childSwimmerFields]
                      updated[selectedChildIndex] = {
                        ...updated[selectedChildIndex],
                        primaryStroke: value,
                      }
                      setParentFields({ ...parentFields, childSwimmerFields: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stroke" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freestyle">Freestyle</SelectItem>
                      <SelectItem value="backstroke">Backstroke</SelectItem>
                      <SelectItem value="breaststroke">Breaststroke</SelectItem>
                      <SelectItem value="butterfly">Butterfly</SelectItem>
                      <SelectItem value="im">Individual Medley</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Stroke</Label>
                  <Select
                    value={parentFields.childSwimmerFields[selectedChildIndex].secondaryStroke}
                    onValueChange={(value) => {
                      const updated = [...parentFields.childSwimmerFields]
                      updated[selectedChildIndex] = {
                        ...updated[selectedChildIndex],
                        secondaryStroke: value,
                      }
                      setParentFields({ ...parentFields, childSwimmerFields: updated })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stroke" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freestyle">Freestyle</SelectItem>
                      <SelectItem value="backstroke">Backstroke</SelectItem>
                      <SelectItem value="breaststroke">Breaststroke</SelectItem>
                      <SelectItem value="butterfly">Butterfly</SelectItem>
                      <SelectItem value="im">Individual Medley</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Child Teams */}
              {renderTeamSection(
                parentFields.childSwimmerFields[selectedChildIndex].teams,
                () => addTeamToChild(selectedChildIndex),
                (id) => removeTeamFromChild(selectedChildIndex, id)
              )}

              <div className="space-y-2">
                <Label>Coach Name</Label>
                <Input
                  value={parentFields.childSwimmerFields[selectedChildIndex].coachName}
                  onChange={(e) => {
                    const updated = [...parentFields.childSwimmerFields]
                    updated[selectedChildIndex] = {
                      ...updated[selectedChildIndex],
                      coachName: e.target.value,
                    }
                    setParentFields({ ...parentFields, childSwimmerFields: updated })
                  }}
                  placeholder="Coach's name"
                />
              </div>

              <div className="space-y-2">
                <Label>Goals</Label>
                <Textarea
                  value={parentFields.childSwimmerFields[selectedChildIndex].goals}
                  onChange={(e) => {
                    const updated = [...parentFields.childSwimmerFields]
                    updated[selectedChildIndex] = {
                      ...updated[selectedChildIndex],
                      goals: e.target.value,
                    }
                    setParentFields({ ...parentFields, childSwimmerFields: updated })
                  }}
                  placeholder="Swimming goals"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )

  const renderCoachFields = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Coach Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coachPhone">Phone Number</Label>
            <Input
              id="coachPhone"
              type="tel"
              value={coachFields.phone}
              onChange={(e) =>
                setCoachFields({ ...coachFields, phone: e.target.value })
              }
              placeholder="(555) 000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years Experience</Label>
            <Input
              id="yearsExperience"
              type="number"
              value={coachFields.yearsExperience}
              onChange={(e) =>
                setCoachFields({ ...coachFields, yearsExperience: e.target.value })
              }
              placeholder="Years"
            />
          </div>
        </div>

        {/* Team/Organization Verification */}
        <div className="space-y-2">
          <Label htmlFor="clubName">Club / Organization</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="clubName"
              value={coachFields.clubName}
              onChange={(e) =>
                setCoachFields({ ...coachFields, clubName: e.target.value })
              }
              className="pl-10"
              placeholder="Your swim club or organization"
            />
          </div>
        </div>

        {/* Company Email Verification */}
        <div className="space-y-2">
          <Label htmlFor="companyEmail" className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Company Email Verification
          </Label>
          <p className="text-xs text-muted-foreground">
            Verify your team affiliation using your organization email
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="companyEmail"
                type="email"
                value={coachFields.companyEmail}
                onChange={(e) =>
                  setCoachFields({ 
                    ...coachFields, 
                    companyEmail: e.target.value,
                    isVerified: false,
                    verificationPending: false,
                  })
                }
                className="pl-10"
                placeholder="coach@swimclub.org"
                disabled={coachFields.isVerified}
              />
            </div>
            <Button
              type="button"
              variant={coachFields.isVerified ? "secondary" : "outline"}
              onClick={handleVerifyCoachEmail}
              disabled={!coachFields.companyEmail || coachFields.isVerified || coachFields.verificationPending}
            >
              {coachFields.isVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                  Verified
                </>
              ) : coachFields.verificationPending ? (
                "Verifying..."
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          {coachFields.isVerified && (
            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Team affiliation verified with {coachFields.clubName}
            </div>
          )}
          {coachFields.verificationPending && (
            <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-lg text-amber-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Verification email sent. Please check your inbox.
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="certification">Certification Level</Label>
          <Select
            value={coachFields.certification}
            onValueChange={(value) =>
              setCoachFields({ ...coachFields, certification: value })
            }
          >
            <SelectTrigger id="certification">
              <SelectValue placeholder="Select certification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA Swimming Level 1">USA Swimming Level 1</SelectItem>
              <SelectItem value="USA Swimming Level 2">USA Swimming Level 2</SelectItem>
              <SelectItem value="USA Swimming Level 3">USA Swimming Level 3</SelectItem>
              <SelectItem value="USA Swimming Level 4">USA Swimming Level 4</SelectItem>
              <SelectItem value="USA Swimming Level 5">USA Swimming Level 5</SelectItem>
              <SelectItem value="ASCA Level 1">ASCA Level 1</SelectItem>
              <SelectItem value="ASCA Level 2">ASCA Level 2</SelectItem>
              <SelectItem value="ASCA Level 3">ASCA Level 3</SelectItem>
              <SelectItem value="ASCA Level 4">ASCA Level 4</SelectItem>
              <SelectItem value="ASCA Level 5">ASCA Level 5</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Specializations</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {coachFields.specializations.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {spec}
                <button
                  type="button"
                  onClick={() => removeSpecialization(spec)}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Add specialization"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSpecialization()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addSpecialization}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={coachFields.bio}
            onChange={(e) =>
              setCoachFields({ ...coachFields, bio: e.target.value })
            }
            placeholder="Tell athletes and parents about yourself..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setCurrentView("profile")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <Waves className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-primary-foreground">
                Edit Profile
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Avatar Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <p className="font-medium">Profile Photo</p>
                <p className="text-sm text-muted-foreground">
                  Tap the camera icon to change your photo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Badge variant="outline" className="capitalize">
                {user?.role}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Account type cannot be changed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Role-specific fields */}
        {user?.role === "swimmer" && renderSwimmerFields()}
        {user?.role === "parent" && renderParentFields()}
        {user?.role === "coach" && renderCoachFields()}

        {/* Delete Account */}
        <Card className="border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
