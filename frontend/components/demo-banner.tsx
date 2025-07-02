import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { DEMO_MODE } from "@/lib/firebase"

export function DemoBanner() {
  if (!DEMO_MODE) return null

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        <strong>Demo Mode:</strong> Firebase is not configured. You can explore the platform with demo data. All data is
        stored locally and will be reset when you refresh the page.
      </AlertDescription>
    </Alert>
  )
}
