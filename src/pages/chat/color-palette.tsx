import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Sparkles } from "lucide-react"

interface ColorAnalysis {
  dominantColors: Array<{ color: string; hex: string; percentage: number }>
  seasonalPalette: string
  recommendations: string[]
}

interface ColorPaletteProps {
  colorAnalysis: ColorAnalysis
  detailed?: boolean
}

export function ColorPalette({ colorAnalysis, detailed = false }: ColorPaletteProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Color Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {colorAnalysis.seasonalPalette} Palette
            </Badge>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Dominant Colors in Your Image</h4>
            {colorAnalysis.dominantColors.map((color, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-medium">{color.color}</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{color.hex}</code>
                  </div>
                  <span className="text-sm text-gray-600">{color.percentage}%</span>
                </div>
                <Progress value={color.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {detailed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Color Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {colorAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
