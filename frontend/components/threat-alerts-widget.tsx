import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const threats = [
  {
    id: 1,
    title: "Suspicious Login Attempts",
    severity: "high",
    asset: "Database Server",
    time: "2 minutes ago",
    status: "investigating",
  },
  {
    id: 2,
    title: "Outdated SSL Certificate",
    severity: "medium",
    asset: "Web Server 01",
    time: "15 minutes ago",
    status: "open",
  },
  {
    id: 3,
    title: "Malware Detection",
    severity: "critical",
    asset: "Employee Laptop",
    time: "1 hour ago",
    status: "resolved",
  },
  {
    id: 4,
    title: "Unusual Network Traffic",
    severity: "low",
    asset: "Firewall",
    time: "2 hours ago",
    status: "open",
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "destructive"
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "secondary"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "investigating":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "open":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function ThreatAlertsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Active Threat Alerts
          </CardTitle>
          <CardDescription>Real-time security threats requiring attention</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {threat.severity === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Shield className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{threat.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {threat.asset} • {threat.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(threat.status)}`}>
                  {threat.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                    <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
