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
import { Search, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExportButtons } from "@/components/ui/export-buttons"
import { Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"

// Mock data - in a real app this would come from your database
const mockOrders = [
  {
    id: "ORD-2024001",
    customer: "John Doe",
    date: "2024-03-20",
    total: 299.99,
    tax: 29.99,
    status: "completed",
    items: 3,
    type: "sell"
  },
  {
    id: "ORD-2024002",
    customer: "Jane Smith",
    date: "2024-03-19",
    total: 149.99,
    tax: 15.00,
    status: "processing",
    items: 2,
    type: "sell"
  },
  {
    id: "ORD-2024003",
    customer: "Supplier Co",
    date: "2024-03-19",
    total: 499.99,
    tax: 50.00,
    status: "pending",
    items: 5,
    type: "buy"
  },
  {
    id: "ORD-2024004",
    customer: "Alice Brown",
    date: "2024-03-18",
    total: 199.99,
    tax: 20.00,
    status: "completed",
    items: 1,
    type: "sell"
  },
  {
    id: "ORD-2024005",
    customer: "Wholesale Inc",
    date: "2024-03-18",
    total: 399.99,
    tax: 40.00,
    status: "processing",
    items: 4,
    type: "buy"
  }
]

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
}

const typeColors = {
  sell: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  buy: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
}

const dateRanges = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" }
]

const valueRanges = [
  { label: "All Values", value: "all" },
  { label: "Under $100", value: "under100" },
  { label: "$100 - $500", value: "100to500" },
  { label: "Over $500", value: "over500" }
]

export default function OrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [valueFilter, setValueFilter] = useState("all")

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesType = typeFilter === "all" || order.type === typeFilter

    const orderDate = new Date(order.date)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))
    
    const matchesDate = dateFilter === "all" || (
      (dateFilter === "7days" && daysDiff <= 7) ||
      (dateFilter === "30days" && daysDiff <= 30) ||
      (dateFilter === "90days" && daysDiff <= 90)
    )

    const matchesValue = valueFilter === "all" || (
      (valueFilter === "under100" && order.total < 100) ||
      (valueFilter === "100to500" && order.total >= 100 && order.total <= 500) ||
      (valueFilter === "over500" && order.total > 500)
    )
    
    return matchesSearch && matchesStatus && matchesType && matchesDate && matchesValue
  })

  const {
    currentPage,
    pageSize,
    paginatedItems: paginatedOrders,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredOrders)

  const exportData = filteredOrders.map(order => ({
    'Order ID': order.id,
    'Customer/Supplier': order.customer,
    'Date': new Date(order.date).toLocaleDateString(),
    'Type': order.type === 'sell' ? 'Sales Order' : 'Purchase Order',
    'Status': order.status.charAt(0).toUpperCase() + order.status.slice(1),
    'Items': order.items,
    'Subtotal': `$${(order.total - order.tax).toFixed(2)}`,
    'Tax': `$${order.tax.toFixed(2)}`,
    'Total': `$${order.total.toFixed(2)}`
  }))

  const summary = [
    `Total Orders: ${filteredOrders.length}`,
    `Sales Orders: ${filteredOrders.filter(o => o.type === 'sell').length}`,
    `Purchase Orders: ${filteredOrders.filter(o => o.type === 'buy').length}`,
    `Total Value: $${filteredOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Orders</h1>
        <div className="flex gap-4">
          <ExportButtons
            data={exportData}
            title="Orders Report"
            subtitle={`Generated from ${filteredOrders.length} orders`}
            summary={summary}
          />
          <Button onClick={() => router.push("/orders/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sell">Sales Orders</SelectItem>
            <SelectItem value="buy">Purchase Orders</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={valueFilter} onValueChange={setValueFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Value range" />
          </SelectTrigger>
          <SelectContent>
            {valueRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Order ID</TableHead>
                <TableHead className="min-w-[120px]">Customer/Supplier</TableHead>
                <TableHead className="min-w-[100px]">Date</TableHead>
                <TableHead className="min-w-[80px]">Items</TableHead>
                <TableHead className="min-w-[100px]">Type</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="text-right min-w-[100px]">Subtotal</TableHead>
                <TableHead className="text-right min-w-[100px]">Tax</TableHead>
                <TableHead className="text-right min-w-[100px]">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
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
                    <Badge variant="secondary" className={typeColors[order.type as keyof typeof typeColors]}>
                      {order.type === "sell" ? "Sales" : "Purchase"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${(order.total - order.tax).toFixed(2)}</TableCell>
                  <TableCell className="text-right">${order.tax.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {paginatedOrders.map((order) => (
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
              <div className="flex flex-col gap-2 items-end">
                <Badge variant="secondary" className={typeColors[order.type as keyof typeof typeColors]}>
                  {order.type === "sell" ? "Sales" : "Purchase"}
                </Badge>
                <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
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
              <div>
                <p className="text-muted-foreground">Subtotal</p>
                <p>${(order.total - order.tax).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tax</p>
                <p>${order.tax.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        ))}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}