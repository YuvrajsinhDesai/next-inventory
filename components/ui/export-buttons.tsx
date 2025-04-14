import { Button } from "@/components/ui/button"
import { handleExport } from "@/lib/export-utils"

interface ExportButtonsProps {
  data: any[]
  title: string
  subtitle?: string
  summary?: string[]
  className?: string
}

export function ExportButtons({ data, title, subtitle, summary, className }: ExportButtonsProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('csv', data, { title, subtitle, summary })}
      >
        Export CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf', data, { title, subtitle, summary })}
      >
        Export PDF
      </Button>
    </div>
  )
}