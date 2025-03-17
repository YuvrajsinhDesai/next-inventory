"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Mock data - in a real app this would come from your database
const mockOrders = [
  {
    id: "ORD-2024001",
    customer: "John Doe",
    date: "2024-03-20",
    total: 299.99,
    status: "completed",
    items: 3
  },
  {
    id: "ORD-2024002",
    customer: "Jane Smith",
    date: "2024-03-19",
    total: 149.99,
    status: "processing",
    items: 2
  },
  {
    id: "ORD-2024003",
    customer: "Bob Johnson",
    date: "2024-03-19",
    total: 499.99,
    status: "pending",
    items: 5
  },
  {
    id: "ORD-2024004",
    customer: "Alice Brown",
    date: "2024-03-18",
    total: 199.99,
    status: "completed",
    items: 1
  },
  {
    id: "ORD-2024005",
    customer: "Charlie Wilson",
    date: "2024-03-18",
    total: 399.99,
    status: "processing",
    items: 4
  }
]

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
}

export default function OrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Order ID</TableHead>
              <TableHead className="min-w-[120px]">Customer</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[80px]">Items</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer hover:bg-muted/50 p-4"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
              </div>
              <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Items</p>
                <p>{order.items} items</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}