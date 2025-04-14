"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const categories = [
  "Electronics",
  "Accessories",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Other"
]

const suppliers = [
  { id: 1, name: "Tech Supplies Co" },
  { id: 2, name: "Global Electronics" },
  { id: 3, name: "Quality Parts Ltd" }
]

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    description: "",
    supplierInventory: [] as Array<{
      supplierId: number;
      supplierName: string;
      quantity: number;
      unitCost: number;
    }>
  })
  const [newSupplierInventory, setNewSupplierInventory] = useState({
    supplierId: "",
    quantity: "",
    unitCost: ""
  })
  const [openSupplierCombobox, setOpenSupplierCombobox] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Product added successfully")
      router.push("/inventory")
    } catch (error) {
      toast.error("Failed to add product")
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

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
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

              {formData.supplierInventory.length > 0 && (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Supplier</th>
                        <th className="text-right p-3">Quantity</th>
                        <th className="text-right p-3">Unit Cost</th>
                        <th className="text-right p-3">Total Cost</th>
                        <th className="w-[100px] p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.supplierInventory.map((si) => (
                        <tr key={si.supplierId} className="border-b">
                          <td className="p-3">{si.supplierName}</td>
                          <td className="text-right p-3">{si.quantity}</td>
                          <td className="text-right p-3">${si.unitCost.toFixed(2)}</td>
                          <td className="text-right p-3">${(si.quantity * si.unitCost).toFixed(2)}</td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSupplierInventory(si.supplierId)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-4 items-end border-t pt-4">
                <div className="space-y-2">
                  <Label>Supplier</Label>
                  <Popover open={openSupplierCombobox} onOpenChange={setOpenSupplierCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSupplierCombobox}
                        className="w-full justify-between"
                      >
                        {newSupplierInventory.supplierId
                          ? suppliers.find((supplier) => supplier.id.toString() === newSupplierInventory.supplierId)?.name
                          : "Select supplier..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput 
                          placeholder="Search suppliers..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandGroup>
                            {filteredSuppliers.map((supplier) => (
                              <CommandItem
                                key={supplier.id}
                                value={supplier.name}
                                onSelect={() => {
                                  setNewSupplierInventory(prev => ({
                                    ...prev,
                                    supplierId: supplier.id.toString()
                                  }))
                                  setOpenSupplierCombobox(false)
                                  setSearchQuery("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newSupplierInventory.supplierId === supplier.id.toString()
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {supplier.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                {isLoading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}