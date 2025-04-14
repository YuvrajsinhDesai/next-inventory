"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
import { toast } from "sonner"

// Mock data - in a real app this would come from your database
const mockProduct = {
  id: 1,
  name: "Product A",
  sku: "SKU001",
  price: 29.99,
  category: "electronics",
  description: "A high-quality electronic product with amazing features.",
  supplierInventory: [
    {
      supplierId: 1,
      supplierName: "Tech Supplies Co",
      quantity: 50,
      unitCost: 20.00
    },
    {
      supplierId: 2,
      supplierName: "Global Electronics",
      quantity: 100,
      unitCost: 19.50
    }
  ]
}

const categories = [
  "Electronics",
  "Accessories",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Other"
]

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(mockProduct)
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Tech Supplies Co" },
    { id: 2, name: "Global Electronics" },
    { id: 3, name: "Quality Parts Ltd" }
  ])
  const [newSupplierInventory, setNewSupplierInventory] = useState({
    supplierId: "",
    quantity: "",
    unitCost: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Product updated successfully")
      router.push("/inventory")
    } catch (error) {
      toast.error("Failed to update product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Product deleted successfully")
      router.push("/inventory")
    } catch (error) {
      toast.error("Failed to delete product")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSupplierInventory = () => {
    if (!newSupplierInventory.supplierId || !newSupplierInventory.quantity || !newSupplierInventory.unitCost) {
      toast.error("Please fill in all supplier inventory fields")
      return
    }

    const supplier = suppliers.find(s => s.id.toString() === newSupplierInventory.supplierId)
    if (!supplier) return

    const newInventory = {
      supplierId: parseInt(newSupplierInventory.supplierId),
      supplierName: supplier.name,
      quantity: parseInt(newSupplierInventory.quantity),
      unitCost: parseFloat(newSupplierInventory.unitCost)
    }

    setFormData(prev => ({
      ...prev,
      supplierInventory: [...prev.supplierInventory, newInventory]
    }))

    setNewSupplierInventory({
      supplierId: "",
      quantity: "",
      unitCost: ""
    })
  }

  const handleRemoveSupplierInventory = (supplierId: number) => {
    setFormData(prev => ({
      ...prev,
      supplierInventory: prev.supplierInventory.filter(si => si.supplierId !== supplierId)
    }))
  }

  const totalQuantity = formData.supplierInventory.reduce((sum, si) => sum + si.quantity, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button
        variant="ghost"
        className="mb-4 sm:mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Inventory
      </Button>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Edit Product</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Product</Button>
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
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background text-sm"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Supplier Inventory</Label>
                  <p className="text-sm text-muted-foreground">Total Quantity: {totalQuantity}</p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.supplierInventory.map((si) => (
                      <TableRow key={si.supplierId}>
                        <TableCell>{si.supplierName}</TableCell>
                        <TableCell className="text-right">{si.quantity}</TableCell>
                        <TableCell className="text-right">${si.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(si.quantity * si.unitCost).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSupplierInventory(si.supplierId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="grid gap-4 sm:grid-cols-4 items-end border-t pt-4">
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select
                      value={newSupplierInventory.supplierId}
                      onValueChange={(value) => setNewSupplierInventory(prev => ({ ...prev, supplierId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newSupplierInventory.quantity}
                      onChange={(e) => setNewSupplierInventory(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Cost</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newSupplierInventory.unitCost}
                      onChange={(e) => setNewSupplierInventory(prev => ({ ...prev, unitCost: e.target.value }))}
                    />
                  </div>
                  <Button type="button" onClick={handleAddSupplierInventory}>
                    Add Supplier Stock
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}