import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Server, Monitor, Wifi, Smartphone } from "lucide-react"

const assetCategories = [
  {
    name: "Servers",
    count: 24,
    critical: 3,
    icon: Server,
    color: "text-blue-500",
  },
  {
    name: "Workstations",
    count: 156,
    critical: 12,
    icon: Monitor,
    color: "text-green-500",
  },
  {
    name: "Network Devices",
    count: 45,
    critical: 2,
    icon: Wifi,
    color: "text-purple-500",
  },
  {
    name: "Mobile Devices",
    count: 89,
    critical: 5,
    icon: Smartphone,
    color: "text-orange-500",
  },
  {
    name: "Databases",
    count: 12,
    critical: 1,
    icon: Database,
    color: "text-red-500",
  },
]

const riskLevels = [
  { level: "Critical", count: 23, color: "bg-red-500" },
  { level: "High", count: 45, color: "bg-orange-500" },
  { level: "Medium", count: 128, color: "bg-yellow-500" },
  { level: "Low", count: 151, color: "bg-green-500" },
]

export function AssetOverviewWidget() {
  const totalAssets = assetCategories.reduce((sum, category) => sum + category.count, 0)
  const totalCritical = assetCategories.reduce((sum, category) => sum + category.critical, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-500" />
            Asset Overview
          </CardTitle>
          <CardDescription>Monitor and manage your IT infrastructure</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Manage Assets
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalAssets}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Total Assets</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{totalCritical}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">Critical Issues</div>
            </div>
          </div>

          {/* Asset Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Asset Categories</h4>
            {assetCategories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <category.icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{category.count}</span>
                  {category.critical > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {category.critical} critical
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Risk Distribution */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Risk Distribution</h4>
            <div className="space-y-2">
              {riskLevels.map((risk) => (
                <div key={risk.level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                    <span className="text-sm">{risk.level}</span>
                  </div>
                  <span className="text-sm font-medium">{risk.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
