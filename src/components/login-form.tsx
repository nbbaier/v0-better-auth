"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import { Mail, KeyRound } from "lucide-react"
import { authClient } from "../lib/auth-client"

interface LoginFormProps {
  onAuthSuccess: (user: any) => void
}

export function LoginForm({ onAuthSuccess }: LoginFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authClient.sendOTP(email, name)
      if (result.success) {
        setOtpSent(true)
        setGeneratedOtp(result.code || "")
        console.log(`[v0] OTP sent to ${email}. Check console for code: ${result.code}`)
      }
    } catch (error) {
      console.error("[v0] Failed to send OTP:", error)
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authClient.verifyOTP(email, otp)

      if (result?.user) {
        onAuthSuccess(result.user)
        console.log("[v0] OTP verified successfully")
      }
    } catch (error: any) {
      console.error("[v0] Failed to verify OTP:", error)
      setError(error.message || "Invalid OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await authClient.sendMagicLink(email, name)
      if (result.success) {
        setMagicLinkSent(true)
        console.log(`[v0] Magic link sent to ${email}. Check console for link.`)
      }
    } catch (error) {
      console.error("[v0] Failed to send magic link:", error)
      setError("Failed to send magic link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Choose your preferred sign-in method</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="otp" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="otp">
                <KeyRound className="mr-2 h-4 w-4" />
                OTP
              </TabsTrigger>
              <TabsTrigger value="magic-link">
                <Mail className="mr-2 h-4 w-4" />
                Magic Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="otp" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-name">Name</Label>
                    <Input
                      id="otp-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otp-email">Email</Label>
                    <Input
                      id="otp-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-code">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">Code sent to {email}</p>
                    {generatedOtp && (
                      <div className="mt-3 rounded-lg bg-muted p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Your OTP code (for demo):</p>
                        <p className="text-lg font-mono font-semibold tracking-wider">{generatedOtp}</p>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp("")
                      setError("")
                      setGeneratedOtp("")
                    }}
                  >
                    Use different email
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="magic-link" className="space-y-4">
              {!magicLinkSent ? (
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="magic-name">Name</Label>
                    <Input
                      id="magic-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="magic-email">Email</Label>
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Magic Link"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="rounded-lg bg-muted p-4">
                    <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-muted-foreground mt-1">We sent a magic link to {email}</p>
                    <p className="text-xs text-muted-foreground mt-2">Check browser console for magic link</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setMagicLinkSent(false)
                      setEmail("")
                      setError("")
                    }}
                  >
                    Use different email
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
