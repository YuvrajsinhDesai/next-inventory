"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Package, AlertTriangle, Search, MinusCircle } from "lucide-react"
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

// Mock data for supplier performance metrics
const mockSupplierPerformance = [
  {
    id: 1,
    name: "Tech Supplies Co",
    onTimeDelivery: 95,
    qualityRating: 4.8,
    responseTime: 24,
    defectRate: 0.5,
    orderAccuracy: 98,
    lastEvaluation: "2024-03-15",
    category: "Electronics",
    region: "West"
  },
  {
    id: 2,
    name: "Global Electronics",
    onTimeDelivery: 88,
    qualityRating: 4.2,
    responseTime: 48,
    defectRate: 1.2,
    orderAccuracy: 95,
    lastEvaluation: "2024-03-10",
    category: "Electronics",
    region: "East"
  },
  {
    id: 3,
    name: "Quality Parts Ltd",
    onTimeDelivery: 92,
    qualityRating: 4.5,
    responseTime: 36,
    defectRate: 0.8,
    orderAccuracy: 97,
    lastEvaluation: "2024-02-28",
    category: "Components",
    region: "Central"
  }
]

const categories = ["All Categories", "Electronics", "Components", "Accessories"]
const regions = ["All Regions", "East", "West", "Central"]
const deliveryRanges = [
  { label: "All Rates", value: "all" },
  { label: "Excellent (95%+)", value: "excellent" },
  { label: "Good (90-95%)", value: "good" },
  { label: "Needs Improvement (<90%)", value: "improvement" }
]

export default function SupplierPerformancePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState("90days")
  const [performanceFilter, setPerformanceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [regionFilter, setRegionFilter] = useState("All Regions")
  const [deliveryFilter, setDeliveryFilter] = useState("all")

  const filteredSuppliers = mockSupplierPerformance.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPerformance = 
      performanceFilter === "all" ||
      (performanceFilter === "high" && supplier.qualityRating >= 4.5) ||
      (performanceFilter === "medium" && supplier.qualityRating >= 4.0 && supplier.qualityRating < 4.5) ||
      (performanceFilter === "low" && supplier.qualityRating < 4.0)

    const matchesCategory = categoryFilter === "All Categories" || supplier.category === categoryFilter
    const matchesRegion = regionFilter === "All Regions" || supplier.region === regionFilter

    const matchesDelivery = 
      deliveryFilter === "all" ||
      (deliveryFilter === "excellent" && supplier.onTimeDelivery >= 95) ||
      (deliveryFilter === "good" && supplier.onTimeDelivery >= 90 && supplier.onTimeDelivery < 95) ||
      (deliveryFilter === "improvement" && supplier.onTimeDelivery < 90)

    return matchesSearch && matchesPerformance && matchesCategory && matchesRegion && matchesDelivery
  })

  const calculateAverage = (metric: keyof typeof mockSupplierPerformance[0]) => {
    if (filteredSuppliers.length === 0) return "-"
    const average = filteredSuppliers.reduce((sum, s) => sum + s[metric], 0) / filteredSuppliers.length
    return typeof average === 'number' && !isNaN(average) ? average.toFixed(1) : "-"
  }

  const performanceData = filteredSuppliers.map(supplier => ({
    'Supplier': supplier.name,
    'Category': supplier.category,
    'Region': supplier.region,
    'On-Time Delivery': `${supplier.onTimeDelivery}%`,
    'Quality Rating': supplier.qualityRating.toFixed(1),
    'Response Time': `${supplier.responseTime}h`,
    'Defect Rate': `${supplier.defectRate}%`,
    'Order Accuracy': `${supplier.orderAccuracy}%`,
    'Last Evaluation': new Date(supplier.lastEvaluation).toLocaleDateString()
  }))

  const summary = [
    `Total Suppliers: ${filteredSuppliers.length}`,
    `Average Quality Rating: ${calculateAverage('qualityRating')}`,
    `Average On-Time Delivery: ${calculateAverage('onTimeDelivery')}%`,
    `Average Response Time: ${calculateAverage('responseTime')}h`
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Supplier Performance</h1>
        </div>
        <ExportButtons
          data={performanceData}
          title="Supplier Performance Report"
          subtitle={`Generated on ${dateFormat(new Date(), 'PPP')}`}
          summary={summary}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Quality Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage('qualityRating')}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage('onTimeDelivery')}%
            </div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage('responseTime')}h
            </div>
            <p className="text-xs text-muted-foreground">To acknowledge orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Defect Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage('defectRate')}%
            </div>
            <p className="text-xs text-muted-foreground">Across all suppliers</p>
          </CardContent>
        </Card>
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
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by performance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="high">High Performance (4.5+)</SelectItem>
            <SelectItem value="medium">Medium Performance (4.0-4.5)</SelectItem>
            <SelectItem value="low">Low Performance (&lt;4.0)</SelectItem>
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
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by delivery" />
          </SelectTrigger>
          <SelectContent>
            {deliveryRanges.map(range => (
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
              <TableHead>Supplier</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Region</TableHead>
              <TableHead className="text-right">Quality Rating</TableHead>
              <TableHead className="text-right">On-Time Delivery</TableHead>
              <TableHead className="text-right">Response Time</TableHead>
              <TableHead className="text-right">Defect Rate</TableHead>
              <TableHead className="text-right">Order Accuracy</TableHead>
              <TableHead>Last Evaluation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <MinusCircle className="h-8 w-8" />
                    <p>No suppliers found matching the current filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.region}</TableCell>
                  <TableCell className="text-right">
                    <span className={
                      supplier.qualityRating >= 4.5 ? "text-green-500" :
                      supplier.qualityRating >= 4.0 ? "text-blue-500" :
                      "text-amber-500"
                    }>
                      {supplier.qualityRating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={supplier.onTimeDelivery >= 95 ? "text-green-500" : "text-amber-500"}>
                      {supplier.onTimeDelivery}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{supplier.responseTime}h</TableCell>
                  <TableCell className="text-right">
                    <span className={supplier.defectRate <= 0.5 ? "text-green-500" : "text-amber-500"}>
                      {supplier.defectRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={supplier.orderAccuracy >= 98 ? "text-green-500" : "text-amber-500"}>
                      {supplier.orderAccuracy}%
                    </span>
                  </TableCell>
                  <TableCell>{new Date(supplier.lastEvaluation).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}