"use client"

import { useState } from "react"
import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Add password reset logic here
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
    }, 1000)
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Package className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you an email with a link to reset your password.
              Please check your inbox and follow the instructions.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Try again
            </Button>
            <div className="text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}