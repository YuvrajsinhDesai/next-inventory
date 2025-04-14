"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Search } from "lucide-react"
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

// Mock customers data
const mockCustomers = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", address: "123 Main St, City, Country" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", address: "456 Oak St, Town, Country" },
  { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", address: "789 Pine St, Village, Country" },
]

// Mock suppliers data
const mockSuppliers = [
  { id: 1, name: "Tech Supplies Co", email: "contact@techsupplies.com", address: "123 Tech Street, Silicon Valley, CA" },
  { id: 2, name: "Global Electronics", email: "orders@globalelec.com", address: "456 Industry Road, New York, NY" },
  { id: 3, name: "Quality Parts Ltd", email: "sales@qualityparts.com", address: "789 Component Ave, Chicago, IL" },
]

// Mock inventory data
const mockInventory = [
  { id: 1, name: "Product A", sku: "SKU001", quantity: 150, price: 29.99 },
  { id: 2, name: "Product B", sku: "SKU002", quantity: 75, price: 49.99 },
  { id: 3, name: "Product C", sku: "SKU003", quantity: 200, price: 19.99 },
]

interface OrderItem {
  productId: number
  quantity: number
  price: number
}

interface Contact {
  id: number
  name: string
  email: string
  address: string
}

export default function CreateOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [orderType, setOrderType] = useState<"buy" | "sell">("sell")
  const [items, setItems] = useState<OrderItem[]>([{ productId: 0, quantity: 1, price: 0 }])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const contacts = orderType === "sell" ? mockCustomers : mockSuppliers
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddItem = () => {
    setItems([...items, { productId: 0, quantity: 1, price: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'productId') {
      const product = mockInventory.find(p => p.id === value)
      if (product) {
        newItems[index].price = product.price
      }
    }
    
    setItems(newItems)
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.price)
    }, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedContact) {
        throw new Error(`Please select a ${orderType === "sell" ? "customer" : "supplier"}`)
      }

      if (orderType === "sell") {
        for (const item of items) {
          const product = mockInventory.find(p => p.id === item.productId)
          if (!product || product.quantity < item.quantity) {
            throw new Error(`Insufficient inventory for ${product?.name || 'selected product'}`)
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${orderType === "buy" ? "Purchase" : "Sales"} order created successfully`)
      router.push("/orders")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create order")
    } finally {
      setIsLoading(false)
    }
  }

  const { subtotal, tax, total } = calculateTotals()

  const handleTypeChange = (value: "buy" | "sell") => {
    setOrderType(value)
    setSelectedContact(null)
    setSearchQuery("")
  }

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

      <Card>
        <CardHeader>
          <CardTitle>Create {orderType === "buy" ? "Purchase" : "Sales"} Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select
                value={orderType}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Purchase Order</SelectItem>
                  <SelectItem value="sell">Sales Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>{orderType === "sell" ? "Customer" : "Supplier"}</Label>
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={searchOpen}
                        className="w-full justify-between"
                      >
                        {selectedContact ? selectedContact.name : `Select ${orderType === "sell" ? "customer" : "supplier"}...`}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput 
                          placeholder={`Search ${orderType === "sell" ? "customers" : "suppliers"}...`}
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No {orderType === "sell" ? "customers" : "suppliers"} found.</CommandEmpty>
                          <CommandGroup>
                            {filteredContacts.map((contact) => (
                              <CommandItem
                                key={contact.id}
                                value={contact.id.toString()}
                                onSelect={() => {
                                  setSelectedContact(contact)
                                  setSearchOpen(false)
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{contact.name}</span>
                                  <span className="text-sm text-muted-foreground">{contact.email}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push(orderType === "sell" ? '/customers/add' : '/suppliers/add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {orderType === "sell" ? "Customer" : "Supplier"}
                </Button>
              </div>

              {selectedContact && (
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm font-medium">{selectedContact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <span className="text-sm font-medium">{selectedContact.address}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>Order Items</Label>
              {items.map((item, index) => (
                <div key={index} className="grid gap-4 sm:grid-cols-4 items-end border-b pb-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={item.productId.toString()}
                      onValueChange={(value) => handleItemChange(index, 'productId', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInventory.map(product => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} ({product.quantity} in stock)
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
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
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
                {isLoading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}