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
import { Plus, Search, Edit, Trash, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { toast } from "sonner"

// Mock data - in a real app this would come from your database
const mockInventory = [
  { 
    id: 1, 
    name: "Product A", 
    sku: "SKU001", 
    price: 29.99, 
    category: "Electronics",
    description: "A high-quality electronic product with amazing features and long-lasting battery life.",
    reorderPoint: 30,
    safetyStock: 20,
    suppliers: [
      { name: "Tech Supplies Co", quantity: 15 },
      { name: "Global Electronics", quantity: 10 }
    ]
  },
  { 
    id: 2, 
    name: "Product B", 
    sku: "SKU002", 
    price: 49.99, 
    category: "Accessories",
    description: "Premium accessory designed for maximum compatibility and durability.",
    reorderPoint: 50,
    safetyStock: 30,
    suppliers: [
      { name: "Quality Parts Ltd", quantity: 75 }
    ]
  },
  { 
    id: 3, 
    name: "Product C", 
    sku: "SKU003", 
    price: 19.99, 
    category: "Electronics",
    description: "Compact and efficient electronic device perfect for everyday use.",
    reorderPoint: 100,
    safetyStock: 50,
    suppliers: [
      { name: "Tech Supplies Co", quantity: 5 },
      { name: "Global Electronics", quantity: 5 }
    ]
  }
]

const categories = [
  "All Categories",
  "Electronics",
  "Accessories",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Other"
]

const stockLevels = [
  { label: "All Stock Levels", value: "all" },
  { label: "High Stock (100+)", value: "high" },
  { label: "Medium Stock (20-100)", value: "medium" },
  { label: "Low Stock (<20)", value: "low" }
]

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under $20", value: "under20" },
  { label: "$20 - $50", value: "20to50" },
  { label: "Over $50", value: "over50" }
]

export default function InventoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [stockFilter, setStockFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof mockInventory[0] | null>(null)

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter

    const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
    const matchesStock = stockFilter === "all" || (
      (stockFilter === "high" && totalQuantity >= 100) ||
      (stockFilter === "medium" && totalQuantity >= 20 && totalQuantity < 100) ||
      (stockFilter === "low" && totalQuantity < 20)
    )

    const matchesPrice = priceFilter === "all" || (
      (priceFilter === "under20" && item.price < 20) ||
      (priceFilter === "20to50" && item.price >= 20 && item.price <= 50) ||
      (priceFilter === "over50" && item.price > 50)
    )

    return matchesSearch && matchesCategory && matchesStock && matchesPrice
  })

  const {
    currentPage,
    pageSize,
    paginatedItems: paginatedInventory,
    handlePageChange,
    handlePageSizeChange
  } = usePagination(filteredInventory)

  const exportData = filteredInventory.map(item => {
    const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
    return {
      'Name': item.name,
      'SKU': item.sku,
      'Category': item.category,
      'Price': `$${item.price.toFixed(2)}`,
      'Total Quantity': totalQuantity,
      'Suppliers': item.suppliers.map(s => `${s.name} (${s.quantity})`).join(', ')
    }
  })

  // Calculate inventory summary metrics
  const inventorySummary = {
    totalProducts: mockInventory.length,
    totalQuantity: mockInventory.reduce((sum, item) => 
      sum + item.suppliers.reduce((supplierSum, supplier) => supplierSum + supplier.quantity, 0), 0
    ),
    totalValue: mockInventory.reduce((sum, item) => {
      const quantity = item.suppliers.reduce((supplierSum, supplier) => supplierSum + supplier.quantity, 0)
      return sum + (quantity * item.price)
    }, 0),
    lowStockItems: mockInventory.filter(item => {
      const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
      return totalQuantity <= item.reorderPoint
    }),
    outOfStockItems: mockInventory.filter(item => 
      item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0) === 0
    ),
    averageStockLevel: mockInventory.reduce((sum, item) => 
      sum + item.suppliers.reduce((supplierSum, supplier) => supplierSum + supplier.quantity, 0), 0
    ) / mockInventory.length
  }

  const summary = [
    `Total Products: ${filteredInventory.length}`,
    `Total Stock: ${filteredInventory.reduce((sum, item) => 
      sum + item.suppliers.reduce((supplierSum, supplier) => supplierSum + supplier.quantity, 0), 0
    )}`,
    `Total Value: $${inventorySummary.totalValue.toFixed(2)}`,
    `Categories: ${Array.from(new Set(filteredInventory.map(item => item.category))).join(', ')}`
  ]

  const handleDelete = async (id: number) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Inventory Management</h1>
        <div className="flex gap-4">
          <ExportButtons
            data={exportData}
            title="Inventory Report"
            subtitle={`Generated from ${filteredInventory.length} products`}
            summary={summary}
          />
          <Button onClick={() => router.push("/inventory/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Inventory Summary Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventorySummary.totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {inventorySummary.totalProducts} products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.totalQuantity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average: {inventorySummary.averageStockLevel.toFixed(0)} per product
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {inventorySummary.lowStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Products below reorder point
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventorySummary.outOfStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Products with zero quantity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {inventorySummary.lowStockItems.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventorySummary.lowStockItems.map(item => {
                const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
                return (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-amber-500">{totalQuantity} in stock</p>
                      <p className="text-sm text-muted-foreground">
                        Reorder Point: {item.reorderPoint}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Stock level" />
          </SelectTrigger>
          <SelectContent>
            {stockLevels.map(level => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Product Name</h4>
                  <p className="text-lg">{selectedProduct.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">SKU</h4>
                    <p>{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <p>{selectedProduct.category}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                  <p className="text-lg font-medium">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Stock Levels</h4>
                  <div className="border rounded-lg divide-y">
                    {selectedProduct.suppliers.map((supplier, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <span>{supplier.name}</span>
                        <span className="font-medium">{supplier.quantity} units</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Reorder Point</h4>
                    <p>{selectedProduct.reorderPoint} units</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Safety Stock</h4>
                    <p>{selectedProduct.safetyStock} units</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => router.push(`/inventory/${selectedProduct.id}`)}>
                  Edit Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Name</TableHead>
                <TableHead className="min-w-[100px]">SKU</TableHead>
                <TableHead className="min-w-[120px]">Category</TableHead>
                <TableHead className="text-right min-w-[100px]">Total Quantity</TableHead>
                <TableHead className="min-w-[200px]">Suppliers</TableHead>
                <TableHead className="text-right min-w-[100px]">Price</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInventory.map((item) => {
                const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
                const isLowStock = totalQuantity <= item.reorderPoint
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium"
                        onClick={() => setSelectedProduct(item)}
                      >
                        {item.name}
                      </Button>
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className={`text-right ${isLowStock ? 'text-amber-500 font-medium' : ''}`}>
                      {totalQuantity}
                      {isLowStock && (
                        <AlertTriangle className="h-4 w-4 inline-block ml-2 text-amber-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.suppliers.map((supplier, index) => (
                          <div key={index} className="text-sm">
                            {supplier.name}: {supplier.quantity}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/inventory/${item.id}`)}
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
                                product from the inventory.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
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
                )
              })}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredInventory.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {paginatedInventory.map((item) => {
          const totalQuantity = item.suppliers.reduce((sum, supplier) => sum + supplier.quantity, 0)
          const isLowStock = totalQuantity <= item.reorderPoint
          return (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => setSelectedProduct(item)}
                  >
                    {item.name}
                  </Button>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Quantity</span>
                  <span className={`font-medium ${isLowStock ? 'text-amber-500' : ''}`}>
                    {totalQuantity}
                    {isLowStock && (
                      <AlertTriangle className="h-4 w-4 inline-block ml-2 text-amber-500" />
                    )}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Suppliers</span>
                  {item.suppliers.map((supplier, index) => (
                    <div key={index} className="text-sm flex justify-between">
                      <span>{supplier.name}</span>
                      <span>{supplier.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/inventory/${item.id}`)}
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
                        product from the inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          )
        })}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredInventory.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}