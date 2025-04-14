import Link from "next/link"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            asChild
          >
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}