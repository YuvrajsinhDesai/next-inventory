"use client"

import { useState } from "react"
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
import { Plus, Search } from "lucide-react"
import { Card } from "@/components/ui/card"

// Mock data - in a real app this would come from your database
const mockInventory = [
  { id: 1, name: "Product A", sku: "SKU001", quantity: 150, price: 29.99, category: "Electronics" },
  { id: 2, name: "Product B", sku: "SKU002", quantity: 75, price: 49.99, category: "Accessories" },
  { id: 3, name: "Product C", sku: "SKU003", quantity: 200, price: 19.99, category: "Electronics" },
  { id: 4, name: "Product D", sku: "SKU004", quantity: 100, price: 39.99, category: "Accessories" },
  { id: 5, name: "Product E", sku: "SKU005", quantity: 50, price: 59.99, category: "Electronics" },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Inventory Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

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
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[100px]">SKU</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="text-right min-w-[100px]">Quantity</TableHead>
              <TableHead className="text-right min-w-[100px]">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="grid gap-4 lg:hidden">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.sku}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{item.quantity}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}