import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCheck, Calendar, AlertCircle } from "lucide-react"

const complianceFrameworks = [
  {
    name: "ISO 27001",
    progress: 87,
    status: "on_track",
    dueDate: "Dec 31, 2024",
    controls: { completed: 26, total: 30 },
  },
  {
    name: "SOC 2 Type II",
    progress: 65,
    status: "behind",
    dueDate: "Sep 15, 2024",
    controls: { completed: 13, total: 20 },
  },
  {
    name: "GDPR",
    progress: 92,
    status: "compliant",
    dueDate: "Ongoing",
    controls: { completed: 23, total: 25 },
  },
  {
    name: "PCI DSS",
    progress: 45,
    status: "at_risk",
    dueDate: "Aug 30, 2024",
    controls: { completed: 9, total: 20 },
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "compliant":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "on_track":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "behind":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "at_risk":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getProgressColor = (progress: number) => {
  if (progress >= 90) return "bg-green-500"
  if (progress >= 70) return "bg-blue-500"
  if (progress >= 50) return "bg-yellow-500"
  return "bg-red-500"
}

export function ComplianceStatusWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <FileCheck className="h-5 w-5 mr-2 text-green-500" />
            Compliance Status
          </CardTitle>
          <CardDescription>Track compliance across multiple frameworks</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View Reports
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complianceFrameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium">{framework.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(framework.status)}`}>
                    {framework.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {framework.dueDate}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>
                    {framework.controls.completed}/{framework.controls.total} controls
                  </span>
                  <span>{framework.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(framework.progress)}`}
                    style={{ width: `${framework.progress}%` }}
                  />
                </div>
              </div>

              {framework.status === "at_risk" && (
                <div className="flex items-center space-x-1 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  <span>Immediate attention required</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
