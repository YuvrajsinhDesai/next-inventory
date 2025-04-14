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
import { Plus, Search, Edit, Trash } from "lucide-react"
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
const mockSuppliers = [
  {
    id: 1,
    name: "Tech Supplies Co",
    email: "contact@techsupplies.com",
    phone: "+1 234-567-8901",
    address: "123 Tech Street, Silicon Valley, CA",
    status: "active",
    totalOrders: 25,
    totalSpent: 24999.99,
    lastOrder: "2024-03-15"
  },
  {
    id: 2,
    name: "Global Electronics",
    email: "orders@globalelec.com",
    phone: "+1 234-567-8902",
    address: "456 Industry Road, New York, NY",
    status: "active",
    totalOrders: 18,
    totalSpent: 15699.99,
    lastOrder: "2024-03-10"
  },
  {
    id: 3,
    name: "Quality Parts Ltd",
    email: "sales@qualityparts.com",
    phone: "+1 234-567-8903",
    address: "789 Component Ave, Chicago, IL",
    status: "inactive",
    totalOrders: 12,
    totalSpent: 8999.99,
    lastOrder: "2024-02-28"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
}

const orderRanges = [
  { label: "All", value: "all" },
  { label: "High Volume (20+)", value: "high" },
  { label: "Medium Volume (10-20)", value: "medium" },
  { label: "Low Volume (<10)", value: "low" }
]

const spendingRanges = [
  { label: "All", value: "all" },
  { label: "High Value ($20,000+)", value: "high" },
  { label: "Medium Value ($10,000-$20,000)", value: "medium" },
  { label: "Low Value (<$10,000)", value: "low" }
]

const lastOrderRanges = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 90 Days", value: "90days" }
]

export default function SuppliersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderVolumeFilter, setOrderVolumeFilter] = useState("all")
  const [spendingFilter, setSpendingFilter] = useState("all")
  const [lastOrderFilter, setLastOrderFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter

    const matchesOrderVolume = orderVolumeFilter === "all" || (
      (orderVolumeFilter === "high" && supplier.totalOrders >= 20) ||
      (orderVolumeFilter === "medium" && supplier.totalOrders >= 10 && supplier.totalOrders < 20) ||
      (orderVolumeFilter === "low" && supplier.totalOrders < 10)
    )

    const matchesSpending = spendingFilter === "all" || (
      (spendingFilter === "high" && supplier.totalSpent >= 20000) ||
      (spendingFilter === "medium" && supplier.totalSpent >= 10000 && supplier.totalSpent < 20000) ||
      (spendingFilter === "low" && supplier.totalSpent < 10000)
    )

    const now = new Date()
    const lastOrderDate = new Date(supplier.lastOrder)
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
    paginatedItems: paginatedSuppliers,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredSuppliers)

  const exportData = filteredSuppliers.map(supplier => ({
    'Name': supplier.name,
    'Email': supplier.email,
    'Phone': supplier.phone,
    'Address': supplier.address,
    'Status': supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1),
    'Total Orders': supplier.totalOrders,
    'Total Spent': `$${supplier.totalSpent.toFixed(2)}`,
    'Last Order': new Date(supplier.lastOrder).toLocaleDateString()
  }))

  const summary = [
    `Total Suppliers: ${filteredSuppliers.length}`,
    `Active Suppliers: ${filteredSuppliers.filter(s => s.status === 'active').length}`,
    `Total Purchase Value: $${filteredSuppliers.reduce((sum, s) => sum + s.totalSpent, 0).toFixed(2)}`,
    `Average Orders per Supplier: ${(filteredSuppliers.reduce((sum, s) => sum + s.totalOrders, 0) / filteredSuppliers.length).toFixed(1)}`
  ]

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Supplier deleted successfully")
    } catch (error) {
      toast.error("Failed to delete supplier")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Suppliers</h1>
        <div className="flex gap-4">
          <ExportButtons
            data={exportData}
            title="Suppliers Report"
            subtitle={`Generated from ${filteredSuppliers.length} suppliers`}
            summary={summary}
          />
          <Button onClick={() => router.push("/suppliers/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
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
              {paginatedSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{supplier.email}</span>
                      <span className="text-sm text-muted-foreground">{supplier.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[supplier.status as keyof typeof statusColors]}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{supplier.totalOrders}</TableCell>
                  <TableCell className="text-right">${supplier.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{new Date(supplier.lastOrder).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/suppliers/${supplier.id}`)}
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
                              supplier and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(supplier.id)}
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
          totalItems={filteredSuppliers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {paginatedSuppliers.map((supplier) => (
          <Card key={supplier.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-medium">{supplier.name}</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-muted-foreground">{supplier.email}</p>
                  <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                </div>
              </div>
              <Badge variant="secondary" className={statusColors[supplier.status as keyof typeof statusColors]}>
                {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-medium">{supplier.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-medium">${supplier.totalSpent.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Last Order</p>
                <p className="font-medium">{new Date(supplier.lastOrder).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/suppliers/${supplier.id}`)}
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
                      supplier and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(supplier.id)}
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
          totalItems={filteredSuppliers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}