import { toast } from "sonner"

interface AuthError {
  message: string
  status?: number
}

export function handleAuthError(error: AuthError) {
  switch (error.message) {
    case "Invalid login credentials":
      toast.error("Invalid email or password", {
        description: "Please check your credentials and try again",
        duration: 5000,
      })
      break
      
    case "Email not confirmed":
      toast.error("Email not confirmed", {
        description: "Please check your inbox and confirm your email address",
        duration: 5000,
        action: {
          label: "Resend confirmation",
          onClick: () => {
            // The resend functionality is handled in the component
            return
          },
        },
      })
      break
      
    case "User already registered":
      toast.error("Account already exists", {
        description: "Please try signing in instead",
        duration: 5000,
        action: {
          label: "Sign in",
          onClick: () => window.location.href = "/login",
        },
      })
      break
      
    case "Password should be at least 6 characters":
      toast.error("Password too short", {
        description: "Please use at least 6 characters",
        duration: 5000,
      })
      break
      
    case "Rate limit exceeded":
      toast.error("Too many attempts", {
        description: "Please try again later",
        duration: 5000,
      })
      break
      
    default:
      toast.error("Authentication error", {
        description: error.message || "An unexpected error occurred",
        duration: 5000,
      })
  }
}