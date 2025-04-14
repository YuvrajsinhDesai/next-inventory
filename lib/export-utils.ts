import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'
import { format as dateFormat } from 'date-fns'
import { toast } from "sonner"

interface ExportOptions {
  title: string
  subtitle?: string
  summary?: string[]
}

export const exportToPDF = async (data: any[], options: ExportOptions, filename: string) => {
  try {
    const doc = new jsPDF()
    
    if (!data || !data.length) {
      toast.error("No data available to export")
      return
    }
    
    // Add header with title
    doc.setFontSize(20)
    doc.setTextColor(44, 62, 80)
    doc.text(options.title, 14, 15)
    
    // Add subtitle if provided
    if (options.subtitle) {
      doc.setFontSize(12)
      doc.setTextColor(108, 117, 125)
      doc.text(options.subtitle, 14, 25)
    }
    
    // Add generation date
    doc.setFontSize(10)
    doc.text(`Generated on: ${dateFormat(new Date(), 'PPP')}`, 14, options.subtitle ? 35 : 25)
    
    // Add summary if provided
    let startY = options.subtitle ? 45 : 35
    if (options.summary && options.summary.length > 0) {
      doc.setFontSize(12)
      doc.setTextColor(44, 62, 80)
      doc.text("Summary", 14, startY)
      
      doc.setFontSize(10)
      options.summary.forEach((line, index) => {
        doc.text(line, 14, startY + 10 + (index * 6))
      })
      startY = startY + 10 + (options.summary.length * 6) + 10
    }
    
    // Convert data to table format
    const tableColumns = Object.keys(data[0]).map(key => 
      key.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + 
      key.split(/(?=[A-Z])/).join(' ').slice(1)
    )
    const tableRows = data.map(item => Object.values(item))
    
    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: startY,
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
    
    // Add footer with page numbers
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

export const exportToCSV = (data: any[], filename: string) => {
  try {
    if (!data || !data.length) {
      toast.error("No data available to export")
      return
    }

    const csv = Papa.unparse(data)
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

export const handleExport = (format: 'pdf' | 'csv', data: any[], options: ExportOptions) => {
  const timestamp = dateFormat(new Date(), 'yyyyMMdd-HHmmss')
  const sanitizedTitle = options.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filename = `${sanitizedTitle}-${timestamp}.${format}`
  
  if (format === 'pdf') {
    exportToPDF(data, options, filename)
  } else {
    exportToCSV(data, filename)
  }
}