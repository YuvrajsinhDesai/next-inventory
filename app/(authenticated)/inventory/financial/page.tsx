"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Calculator, 
  Search, 
  MinusCircle,
  ArrowUpDown,
  ArrowDownUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExportButtons } from "@/components/ui/export-buttons"
import { format as dateFormat } from 'date-fns'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data for inventory transactions
const mockInventoryTransactions = [
  {
    id: 1,
    productId: 1,
    productName: "Product A",
    date: "2024-03-01",
    type: "purchase",
    quantity: 100,
    unitCost: 20.00,
    totalCost: 2000.00,
    category: "Electronics",
    supplier: "Tech Supplies Co"
  },
  {
    id: 2,
    productId: 1,
    productName: "Product A",
    date: "2024-03-10",
    type: "sale",
    quantity: 60,
    unitCost: 20.00,
    totalCost: 1200.00,
    category: "Electronics",
    customer: "Customer A"
  },
  {
    id: 3,
    productId: 1,
    productName: "Product A",
    date: "2024-03-15",
    type: "purchase",
    quantity: 50,
    unitCost: 22.00,
    totalCost: 1100.00,
    category: "Electronics",
    supplier: "Global Electronics"
  },
  {
    id: 4,
    productId: 1,
    productName: "Product A",
    date: "2024-03-20",
    type: "sale",
    quantity: 40,
    unitCost: 21.00,
    totalCost: 840.00,
    category: "Electronics",
    customer: "Customer B"
  }
]

// Mock data for current inventory
const mockCurrentInventory = [
  {
    id: 1,
    name: "Product A",
    quantity: 50,
    averageCost: 21.00,
    lastPurchaseCost: 22.00,
    totalValue: 1050.00,
    reorderPoint: 30,
    salesPrice: 35.00,
    margin: 40,
    category: "Electronics"
  },
  {
    id: 2,
    name: "Product B",
    quantity: 75,
    averageCost: 45.00,
    lastPurchaseCost: 48.00,
    totalValue: 3375.00,
    reorderPoint: 50,
    salesPrice: 75.00,
    margin: 40,
    category: "Accessories"
  },
  {
    id: 3,
    name: "Product C",
    quantity: 25,
    averageCost: 15.00,
    lastPurchaseCost: 16.00,
    totalValue: 375.00,
    reorderPoint: 20,
    salesPrice: 25.00,
    margin: 40,
    category: "Components"
  }
]

const valuationMethods = [
  { label: "FIFO (First In, First Out)", value: "fifo" },
  { label: "LIFO (Last In, First Out)", value: "lifo" },
  { label: "Weighted Average Cost", value: "average" }
]

const timeRanges = [
  { label: "Last 30 Days", value: "30days" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Last Year", value: "year" },
  { label: "All Time", value: "all" }
]

const categories = ["All Categories", "Electronics", "Accessories", "Components"]

const valueRanges = [
  { label: "All Values", value: "all" },
  { label: "High Value ($1000+)", value: "high" },
  { label: "Medium Value ($100-$1000)", value: "medium" },
  { label: "Low Value (<$100)", value: "low" }
]

const marginRanges = [
  { label: "All Margins", value: "all" },
  { label: "High Margin (40%+)", value: "high" },
  { label: "Medium Margin (20-40%)", value: "medium" },
  { label: "Low Margin (<20%)", value: "low" }
]

const transactionTypes = [
  { label: "All Types", value: "all" },
  { label: "Purchases", value: "purchase" },
  { label: "Sales", value: "sale" }
]

const transactionValueRanges = [
  { label: "All Values", value: "all" },
  { label: "High Value ($2000+)", value: "high" },
  { label: "Medium Value ($500-$2000)", value: "medium" },
  { label: "Low Value (<$500)", value: "low" }
]

export default function FinancialReportsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [valuationMethod, setValuationMethod] = useState("average")
  const [timeRange, setTimeRange] = useState("30days")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [valueFilter, setValueFilter] = useState("all")
  const [marginFilter, setMarginFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("valuation")
  const [transactionSearch, setTransactionSearch] = useState("")
  const [transactionType, setTransactionType] = useState("all")
  const [transactionTimeRange, setTransactionTimeRange] = useState("30days")
  const [transactionCategory, setTransactionCategory] = useState("All Categories")
  const [transactionValue, setTransactionValue] = useState("all")

  // Filter inventory based on selected criteria
  const filteredInventory = mockCurrentInventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter

    const matchesValue = valueFilter === "all" || (
      (valueFilter === "high" && item.totalValue >= 1000) ||
      (valueFilter === "medium" && item.totalValue >= 100 && item.totalValue < 1000) ||
      (valueFilter === "low" && item.totalValue < 100)
    )

    const matchesMargin = marginFilter === "all" || (
      (marginFilter === "high" && item.margin >= 40) ||
      (marginFilter === "medium" && item.margin >= 20 && item.margin < 40) ||
      (marginFilter === "low" && item.margin < 20)
    )

    return matchesSearch && matchesCategory && matchesValue && matchesMargin
  })

  // Filter transactions based on selected criteria
  const filteredTransactions = mockInventoryTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.productName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      transaction.category.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      (transaction.supplier?.toLowerCase() || "").includes(transactionSearch.toLowerCase()) ||
      (transaction.customer?.toLowerCase() || "").includes(transactionSearch.toLowerCase())

    const matchesType = transactionType === "all" || transaction.type === transactionType
    const matchesCategory = transactionCategory === "All Categories" || transaction.category === transactionCategory

    const matchesValue = transactionValue === "all" || (
      (transactionValue === "high" && transaction.totalCost >= 2000) ||
      (transactionValue === "medium" && transaction.totalCost >= 500 && transaction.totalCost < 2000) ||
      (transactionValue === "low" && transaction.totalCost < 500)
    )

    const transactionDate = new Date(transaction.date)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24))

    const matchesTimeRange = transactionTimeRange === "all" || (
      (transactionTimeRange === "30days" && daysDiff <= 30) ||
      (transactionTimeRange === "quarter" && daysDiff <= 90) ||
      (transactionTimeRange === "year" && daysDiff <= 365)
    )

    return matchesSearch && matchesType && matchesCategory && matchesValue && matchesTimeRange
  })

  // Calculate inventory value based on selected method
  const calculateInventoryValue = () => {
    switch (valuationMethod) {
      case "fifo":
        return filteredInventory.reduce((total, item) => 
          total + (item.quantity * item.lastPurchaseCost), 0)
      case "lifo":
        return filteredInventory.reduce((total, item) => 
          total + (item.quantity * item.lastPurchaseCost), 0)
      case "average":
      default:
        return filteredInventory.reduce((total, item) => 
          total + (item.quantity * item.averageCost), 0)
    }
  }

  // Calculate COGS
  const calculateCOGS = () => {
    const sales = mockInventoryTransactions
      .filter(t => t.type === "sale")
      .reduce((total, t) => total + t.totalCost, 0)
    return sales
  }

  // Calculate Gross Margin
  const calculateGrossMargin = () => {
    const sales = mockInventoryTransactions
      .filter(t => t.type === "sale")
      .reduce((total, t) => total + (t.quantity * mockCurrentInventory.find(i => i.id === t.productId)?.salesPrice || 0), 0)
    const cogs = calculateCOGS()
    return sales > 0 ? ((sales - cogs) / sales * 100).toFixed(2) : "0.00"
  }

  // Calculate Average Margin
  const calculateAverageMargin = () => {
    if (filteredInventory.length === 0) return "0.00"
    const totalMargin = filteredInventory.reduce((sum, item) => sum + item.margin, 0)
    return (totalMargin / filteredInventory.length).toFixed(2)
  }

  // Calculate transaction summary metrics
  const transactionSummary = {
    totalTransactions: filteredTransactions.length,
    totalPurchases: filteredTransactions.filter(t => t.type === "purchase")
      .reduce((sum, t) => sum + t.totalCost, 0),
    totalSales: filteredTransactions.filter(t => t.type === "sale")
      .reduce((sum, t) => sum + t.totalCost, 0),
    averageTransactionValue: filteredTransactions.length > 0
      ? filteredTransactions.reduce((sum, t) => sum + t.totalCost, 0) / filteredTransactions.length
      : 0
  }

  // Prepare valuation export data
  const valuationData = filteredInventory.map(item => ({
    'Product': item.name,
    'Category': item.category,
    'Quantity': item.quantity,
    'Unit Cost': `$${item.averageCost.toFixed(2)}`,
    'Total Value': `$${item.totalValue.toFixed(2)}`,
    'Sales Price': `$${item.salesPrice.toFixed(2)}`,
    'Margin': `${item.margin}%`
  }))

  // Prepare transaction export data
  const transactionData = filteredTransactions.map(transaction => ({
    'Date': new Date(transaction.date).toLocaleDateString(),
    'Product': transaction.productName,
    'Category': transaction.category,
    'Type': transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
    'Party': transaction.supplier || transaction.customer || '',
    'Quantity': transaction.quantity,
    'Unit Cost': `$${transaction.unitCost.toFixed(2)}`,
    'Total': `$${transaction.totalCost.toFixed(2)}`
  }))

  const summary = [
    `Total Inventory Value: $${calculateInventoryValue().toFixed(2)}`,
    `Cost of Goods Sold: $${calculateCOGS().toFixed(2)}`,
    `Gross Margin: ${calculateGrossMargin()}%`,
    `Average Product Margin: ${calculateAverageMargin()}%`,
    `Total Products: ${filteredInventory.length}`
  ]

  const transactionSummaryText = [
    `Total Transactions: ${transactionSummary.totalTransactions}`,
    `Total Purchases: $${transactionSummary.totalPurchases.toFixed(2)}`,
    `Total Sales: $${transactionSummary.totalSales.toFixed(2)}`,
    `Average Transaction Value: $${transactionSummary.averageTransactionValue.toFixed(2)}`
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Financial Reports</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${calculateInventoryValue().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Using {valuationMethod.toUpperCase()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost of Goods Sold</CardTitle>
            <Calculator className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${calculateCOGS().toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gross Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateGrossMargin()}%
            </div>
            <p className="text-xs text-muted-foreground">Based on sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverageMargin()}%
            </div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="valuation">Inventory Valuation</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="valuation">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold">Inventory Valuation Report</h2>
              <p className="text-sm text-muted-foreground">
                Generated on {dateFormat(new Date(), 'PPP')}
              </p>
            </div>
            <ExportButtons
              data={valuationData}
              title="Inventory Valuation Report"
              subtitle={`Generated on ${dateFormat(new Date(), 'PPP')}`}
              summary={summary}
            />
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
            <Select value={valuationMethod} onValueChange={setValuationMethod}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Valuation method" />
              </SelectTrigger>
              <SelectContent>
                {valuationMethods.map(method => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
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
            <Select value={valueFilter} onValueChange={setValueFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by value" />
              </SelectTrigger>
              <SelectContent>
                {valueRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={marginFilter} onValueChange={setMarginFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by margin" />
              </SelectTrigger>
              <SelectContent>
                {marginRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Sales Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <MinusCircle className="h-8 w-8" />
                        <p>No products found matching the current filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.averageCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.totalValue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.salesPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.margin}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold">Transaction Report</h2>
              <p className="text-sm text-muted-foreground">
                Generated on {dateFormat(new Date(), 'PPP')}
              </p>
            </div>
            <ExportButtons
              data={transactionData}
              title="Transaction Report"
              subtitle={`Generated on ${dateFormat(new Date(), 'PPP')}`}
              summary={transactionSummaryText}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {transactionSummary.totalTransactions}
                </div>
                <p className="text-xs text-muted-foreground">In selected period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <ArrowDownUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionSummary.totalPurchases.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Cost of purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionSummary.totalSales.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Revenue from sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Value</CardTitle>
                <Calculator className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${transactionSummary.averageTransactionValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={transactionTimeRange} onValueChange={setTransactionTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
            <Select value={transactionCategory} onValueChange={setTransactionCategory}>
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
            <Select value={transactionValue} onValueChange={setTransactionValue}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by value" />
              </SelectTrigger>
              <SelectContent>
                {transactionValueRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <MinusCircle className="h-8 w-8" />
                        <p>No transactions found matching the current filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.productName}</TableCell>
                      <TableCell>
                        <span className={
                          transaction.type === "purchase" ? "text-blue-500" : "text-green-500"
                        }>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.supplier || transaction.customer}</TableCell>
                      <TableCell className="text-right">{transaction.quantity}</TableCell>
                      <TableCell className="text-right">${transaction.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${transaction.totalCost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}