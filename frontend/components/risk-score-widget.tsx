import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Shield } from "lucide-react"

const riskMetrics = [
  {
    category: "Vulnerability Risk",
    score: 72,
    trend: "up",
    change: "+5%",
    description: "Unpatched vulnerabilities detected",
  },
  {
    category: "Compliance Risk",
    score: 45,
    trend: "down",
    change: "-8%",
    description: "Improving compliance posture",
  },
  {
    category: "Access Control Risk",
    score: 38,
    trend: "down",
    change: "-12%",
    description: "Enhanced access controls implemented",
  },
  {
    category: "Data Protection Risk",
    score: 55,
    trend: "up",
    change: "+3%",
    description: "Data encryption gaps identified",
  },
]

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-red-600"
  if (score >= 50) return "text-orange-600"
  if (score >= 30) return "text-yellow-600"
  return "text-green-600"
}

const getProgressColor = (score: number) => {
  if (score >= 70) return "bg-red-500"
  if (score >= 50) return "bg-orange-500"
  if (score >= 30) return "bg-yellow-500"
  return "bg-green-500"
}

const overallRiskScore = Math.round(riskMetrics.reduce((sum, metric) => sum + metric.score, 0) / riskMetrics.length)

export function RiskScoreWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
            Risk Assessment
          </CardTitle>
          <CardDescription>Overall security risk analysis and trends</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Full Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(overallRiskScore)}`}>{overallRiskScore}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Overall Risk Score</div>
            <div className="mt-2">
              <Badge
                variant={overallRiskScore >= 70 ? "destructive" : overallRiskScore >= 50 ? "secondary" : "outline"}
              >
                {overallRiskScore >= 70 ? "High Risk" : overallRiskScore >= 50 ? "Medium Risk" : "Low Risk"}
              </Badge>
            </div>
          </div>

          {/* Risk Categories */}
          <div className="space-y-4">
            {riskMetrics.map((metric) => (
              <div key={metric.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{metric.category}</span>
                    <div className="flex items-center space-x-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                      <span className={`text-xs ${metric.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(metric.score)}`}>{metric.score}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.score)}`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
              </div>
            ))}
          </div>

          {/* Insurance Readiness */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                Insurance Readiness
              </h4>
              <Badge variant="secondary">78%</Badge>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
              Your organization meets most cyber insurance requirements
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500 transition-all duration-300" style={{ width: "78%" }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
