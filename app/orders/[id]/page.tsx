"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data - in a real app this would come from your database
const mockOrderDetails = {
  "ORD-2024001": {
    id: "ORD-2024001",
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2024-03-20",
    status: "completed",
    shippingAddress: "123 Main St, City, Country",
    items: [
      { id: 1, name: "Product A", quantity: 1, price: 99.99 },
      { id: 2, name: "Product B", quantity: 2, price: 100.00 }
    ]
  },
  "ORD-2024002": {
    id: "ORD-2024002",
    customer: "Jane Smith",
    email: "jane.smith@example.com",
    date: "2024-03-19",
    status: "processing",
    shippingAddress: "456 Oak St, Town, Country",
    items: [
      { id: 3, name: "Product C", quantity: 1, price: 149.99 }
    ]
  },
  "ORD-2024003": {
    id: "ORD-2024003",
    customer: "Bob Johnson",
    email: "bob.johnson@example.com",
    date: "2024-03-19",
    status: "pending",
    shippingAddress: "789 Pine St, Village, Country",
    items: [
      { id: 4, name: "Product D", quantity: 3, price: 166.66 }
    ]
  },
  "ORD-2024004": {
    id: "ORD-2024004",
    customer: "Alice Brown",
    email: "alice.brown@example.com",
    date: "2024-03-18",
    status: "completed",
    shippingAddress: "321 Elm St, City, Country",
    items: [
      { id: 5, name: "Product E", quantity: 1, price: 199.99 }
    ]
  },
  "ORD-2024005": {
    id: "ORD-2024005",
    customer: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    date: "2024-03-18",
    status: "processing",
    shippingAddress: "654 Maple St, Town, Country",
    items: [
      { id: 6, name: "Product F", quantity: 2, price: 199.99 }
    ]
  }
}

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
}

export default function OrderDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const order = mockOrderDetails[id as keyof typeof mockOrderDetails]

  if (!order) {
    return <div>Order not found</div>
  }

  const total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Order {order.id}</h1>
          <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="text-sm font-medium break-words">{order.customer}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="text-sm font-medium break-words">{order.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Order Date</dt>
                  <dd className="text-sm font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Address</dt>
                  <dd className="text-sm font-medium break-words">{order.shippingAddress}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="min-w-[150px]">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                    <TableCell className="text-right font-bold">${total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-right">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Price</p>
                      <p>${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Total</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}