"use client"

import Link from "next/link"
import { Package, ArrowRight, BarChart3, ShoppingCart, Users, CheckCircle2, Shield, Zap, Building2, Factory, ShoppingBag, Truck, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Package,
    title: "Real-time Inventory Tracking",
    description: "Monitor stock levels, movements, and locations in real-time with automated updates."
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description: "Streamline purchase orders and sales with automated workflows and approvals."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Make data-driven decisions with comprehensive reporting and forecasting."
  },
  {
    icon: Zap,
    title: "Automated Reordering",
    description: "Set automatic reorder points and never run out of stock again."
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with role-based access control and audit trails."
  },
  {
    icon: HeartHandshake,
    title: "Supplier Management",
    description: "Maintain strong relationships with suppliers through integrated communication."
  }
]

const industries = [
  {
    icon: Building2,
    name: "Retail",
    description: "Perfect for both small shops and large retail chains"
  },
  {
    icon: Factory,
    name: "Manufacturing",
    description: "Streamline production and component inventory"
  },
  {
    icon: ShoppingBag,
    name: "E-commerce",
    description: "Integrate with your online store seamlessly"
  },
  {
    icon: Truck,
    name: "Distribution",
    description: "Manage multiple warehouses efficiently"
  }
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col align-center">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span className="font-bold">Inventory Pro</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline hidden sm:inline-block">Features</Link>
          <Link href="#solutions" className="text-sm font-medium hover:underline hidden sm:inline-block">Solutions</Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Streamline Your Inventory Management
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Powerful, intuitive, and comprehensive inventory management solution for modern businesses.
                  Take control of your stock with real-time tracking and insights.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/signup">
                  <Button size="lg" className="min-w-[200px]">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Powerful Features for Modern Businesses
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to manage your inventory efficiently and scale your business
                </p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8 md:mt-12">
              {features.map((feature, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Solutions for Every Industry
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Tailored solutions to meet your industry-specific needs
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8 md:mt-12">
              {industries.map((industry, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <industry.icon className="h-12 w-12 mb-4 text-primary" />
                    <h3 className="font-bold text-xl mb-2">{industry.name}</h3>
                    <p className="text-gray-500">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Inventory Management?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of businesses that trust Inventory Pro
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="min-w-[200px]">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="font-bold">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-500 hover:text-gray-900">Features</Link></li>
                <li><Link href="#solutions" className="text-gray-500 hover:text-gray-900">Solutions</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">About</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Blog</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Documentation</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Terms</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="font-bold">Inventory Pro</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Inventory Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}