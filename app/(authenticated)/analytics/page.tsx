"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { Button } from "@/components/ui/button"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { toast } from "sonner"
import Papa from 'papaparse'

// Mock data
const salesData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 198 },
  { month: "Mar", sales: 2000, orders: 167 },
  { month: "Apr", sales: 2780, orders: 189 },
  { month: "May", sales: 1890, orders: 145 },
  { month: "Jun", sales: 2390, orders: 178 },
  { month: "Jul", sales: 3490, orders: 234 },
  { month: "Aug", sales: 4000, orders: 267 },
  { month: "Sep", sales: 2780, orders: 198 },
  { month: "Oct", sales: 1890, orders: 167 },
  { month: "Nov", sales: 2390, orders: 187 },
  { month: "Dec", sales: 3490, orders: 234 }
]

const categoryData = [
  { name: "Electronics", value: 4000 },
  { name: "Accessories", value: 3000 },
  { name: "Clothing", value: 2000 },
  { name: "Books", value: 1500 },
  { name: "Other", value: 1000 }
]

const inventoryData = [
  { category: "Electronics", inStock: 150, lowStock: 30, outOfStock: 10 },
  { category: "Accessories", inStock: 200, lowStock: 20, outOfStock: 5 },
  { category: "Clothing", inStock: 180, lowStock: 25, outOfStock: 8 },
  { category: "Books", inStock: 120, lowStock: 15, outOfStock: 3 },
  { category: "Other", inStock: 90, lowStock: 10, outOfStock: 2 }
]

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year")
  const [reportType, setReportType] = useState("basic")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const getAdvancedReportData = () => {
    // In a real app, this would fetch and process data based on the selected time range
    return salesData.map(item => ({
      period: item.month,
      revenue: item.sales,
      orders: item.orders,
      averageOrderValue: (item.sales / item.orders).toFixed(2),
      orderGrowth: ((item.orders - 150) / 150 * 100).toFixed(1)
    }))
  }

  const getSummaryText = () => {
    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0)
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
    const avgOrderValue = totalSales / totalOrders

    return [
      `Total Sales: $${totalSales.toLocaleString()}`,
      `Total Orders: ${totalOrders}`,
      `Average Order Value: $${avgOrderValue.toFixed(2)}`,
      `Best Performing Category: ${categoryData[0].name}`
    ].join('\n')
  }

  const exportToPDF = async (data: any[], title: string, filename: string) => {
    try {
      const doc = new jsPDF()
      const exportData = reportType === "advanced" ? getAdvancedReportData() : data
      
      if (!exportData || !exportData.length) {
        toast.error("No data available to export")
        return
      }
      
      // Add header with logo and title
      doc.setFontSize(20)
      doc.setTextColor(44, 62, 80)
      doc.text("Analytics Report", 14, 15)
      
      // Add metadata
      doc.setFontSize(10)
      doc.setTextColor(108, 117, 125)
      doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 25)
      doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 14, 30)
      doc.text(`Time Range: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`, 14, 35)
      
      // Add report title
      doc.setFontSize(16)
      doc.setTextColor(44, 62, 80)
      doc.text(title, 14, 45)
      
      // Add summary section
      doc.setFontSize(12)
      doc.text("Summary", 14, 55)
      const summaryText = getSummaryText()
      doc.setFontSize(10)
      doc.text(summaryText, 14, 65)
      
      // Convert data to table format
      const tableColumns = Object.keys(exportData[0]).map(key => 
        key.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
        key.split(/(?=[A-Z])/).join(' ').slice(1)
      )
      const tableRows = exportData.map(item => Object.values(item))
      
      // Add table
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 85,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [44, 62, 80],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        }
      })
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        )
      }
      
      doc.save(filename)
      toast.success("PDF file downloaded successfully")
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error("Failed to generate PDF")
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    try {
      const exportData = reportType === "advanced" ? getAdvancedReportData() : data
      if (!exportData || !exportData.length) {
        toast.error("No data available to export")
        return
      }

      const csv = Papa.unparse(exportData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success("CSV file downloaded successfully")
    } catch (error) {
      console.error('CSV generation error:', error)
      toast.error("Failed to generate CSV")
    }
  }

  const handleExport = (format: 'pdf' | 'csv', data: any[], title: string) => {
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss')
    const filename = `analytics-report-${timestamp}.${format}`
    
    if (format === 'pdf') {
      exportToPDF(data, title, filename)
    } else {
      exportToCSV(data, filename)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Report</SelectItem>
              <SelectItem value="advanced">Advanced Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Sales Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Overview</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv', salesData, 'Sales Overview')}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf', salesData, 'Sales Overview')}
              >
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--chart-1))"
                    name="Sales ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--chart-2))"
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sales by Category */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sales by Category</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv', categoryData, 'Sales by Category')}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf', categoryData, 'Sales by Category')}
                >
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Inventory Status</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('csv', inventoryData, 'Inventory Status')}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('pdf', inventoryData, 'Inventory Status')}
                >
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inStock" stackId="a" fill="hsl(var(--chart-1))" name="In Stock" />
                    <Bar dataKey="lowStock" stackId="a" fill="hsl(var(--chart-2))" name="Low Stock" />
                    <Bar dataKey="outOfStock" stackId="a" fill="hsl(var(--chart-3))" name="Out of Stock" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}