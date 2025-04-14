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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash, Mail, Phone } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ExportButtons } from "@/components/ui/export-buttons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"

// Mock data - in a real app this would come from your database
const mockCustomers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234-567-8901",
    status: "active",
    totalOrders: 15,
    totalSpent: 1499.99,
    lastOrder: "2024-03-15"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234-567-8902",
    status: "inactive",
    totalOrders: 8,
    totalSpent: 899.99,
    lastOrder: "2024-02-28"
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1 234-567-8903",
    status: "active",
    totalOrders: 12,
    totalSpent: 1299.99,
    lastOrder: "2024-03-10"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
}

const orderRanges = [
  { label: "All", value: "all" },
  { label: "High Volume (15+)", value: "high" },
  { label: "Medium Volume (5-15)", value: "medium" },
  { label: "Low Volume (<5)", value: "low" }
]

const spendingRanges = [
  { label: "All", value: "all" },
  { label: "High Value ($1,500+)", value: "high" },
  { label: "Medium Value ($500-$1,500)", value: "medium" },
  { label: "Low Value (<$500)", value: "low" }
]

const lastOrderRanges = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" }
]

export default function CustomersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderVolumeFilter, setOrderVolumeFilter] = useState("all")
  const [spendingFilter, setSpendingFilter] = useState("all")
  const [lastOrderFilter, setLastOrderFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    const matchesOrderVolume = orderVolumeFilter === "all" || (
      (orderVolumeFilter === "high" && customer.totalOrders >= 15) ||
      (orderVolumeFilter === "medium" && customer.totalOrders >= 5 && customer.totalOrders < 15) ||
      (orderVolumeFilter === "low" && customer.totalOrders < 5)
    )

    const matchesSpending = spendingFilter === "all" || (
      (spendingFilter === "high" && customer.totalSpent >= 1500) ||
      (spendingFilter === "medium" && customer.totalSpent >= 500 && customer.totalSpent < 1500) ||
      (spendingFilter === "low" && customer.totalSpent < 500)
    )

    const now = new Date()
    const lastOrderDate = new Date(customer.lastOrder)
    const daysDiff = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))

    const matchesLastOrder = lastOrderFilter === "all" || (
      (lastOrderFilter === "7days" && daysDiff <= 7) ||
      (lastOrderFilter === "30days" && daysDiff <= 30) ||
      (lastOrderFilter === "90days" && daysDiff <= 90)
    )

    return matchesSearch && matchesStatus && matchesOrderVolume && matchesSpending && matchesLastOrder
  })

  const {
    currentPage,
    pageSize,
    paginatedItems: paginatedCustomers,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredCustomers)

  const exportData = filteredCustomers.map(customer => ({
    'Name': customer.name,
    'Email': customer.email,
    'Phone': customer.phone,
    'Status': customer.status.charAt(0).toUpperCase() + customer.status.slice(1),
    'Total Orders': customer.totalOrders,
    'Total Spent': `$${customer.totalSpent.toFixed(2)}`,
    'Last Order': new Date(customer.lastOrder).toLocaleDateString()
  }))

  const summary = [
    `Total Customers: ${filteredCustomers.length}`,
    `Active Customers: ${filteredCustomers.filter(c => c.status === 'active').length}`,
    `Total Revenue: $${filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`,
    `Average Orders per Customer: ${(filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0) / filteredCustomers.length).toFixed(1)}`
  ]

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Customer deleted successfully")
    } catch (error) {
      toast.error("Failed to delete customer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Customers</h1>
        <div className="flex gap-4">
          <ExportButtons
            data={exportData}
            title="Customers Report"
            subtitle={`Generated from ${filteredCustomers.length} customers`}
            summary={summary}
          />
          <Button onClick={() => router.push("/customers/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={orderVolumeFilter} onValueChange={setOrderVolumeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Order volume" />
          </SelectTrigger>
          <SelectContent>
            {orderRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={spendingFilter} onValueChange={setSpendingFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Spending range" />
          </SelectTrigger>
          <SelectContent>
            {spendingRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={lastOrderFilter} onValueChange={setLastOrderFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Last order" />
          </SelectTrigger>
          <SelectContent>
            {lastOrderRanges.map(range => (
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
                <TableHead className="min-w-[200px]">Name</TableHead>
                <TableHead className="min-w-[200px]">Contact</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="text-right min-w-[100px]">Orders</TableHead>
                <TableHead className="text-right min-w-[120px]">Total Spent</TableHead>
                <TableHead className="min-w-[120px]">Last Order</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[customer.status as keyof typeof statusColors]}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{customer.totalOrders}</TableCell>
                  <TableCell className="text-right">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/customers/${customer.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              customer and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(customer.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCustomers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {paginatedCustomers.map((customer) => (
          <Card key={customer.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">{customer.name}</p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {customer.phone}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className={statusColors[customer.status as keyof typeof statusColors]}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-medium">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Last Order</p>
                <p className="font-medium">{new Date(customer.lastOrder).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/customers/${customer.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      customer and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(customer.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredCustomers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}