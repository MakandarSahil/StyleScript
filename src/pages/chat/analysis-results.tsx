"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Palette, User, Lightbulb, TrendingUp, Award, Eye } from "lucide-react"

interface AnalysisData {
  skinTone: {
    category: string
    undertone: string
    hex: string
    confidence: number
    description: string
  }
  colorAnalysis: {
    dominantColors: Array<{ name: string; hex: string; percentage: number }>
    seasonalType: string
    colorHarmony: string
    recommendations: string[]
  }
  geminiInsights: {
    personalityProfile: string
    styleRecommendations: Array<{
      category: string
      items: string[]
      reasoning: string
    }>
    colorPairings: Array<{ primary: string; secondary: string; accent: string }>
    professionalAdvice: string[]
  }
}

interface AnalysisResultsProps {
  data: AnalysisData
  uploadedImage: string | null
}

export function AnalysisResults({ data, uploadedImage }: AnalysisResultsProps) {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-lg">Skin Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {uploadedImage && (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: data.skinTone.hex }}
                  />
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {data.skinTone.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{data.skinTone.undertone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Confidence</span>
                <span className="font-semibold">{data.skinTone.confidence}%</span>
              </div>
              <Progress value={data.skinTone.confidence} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-lg">Color Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                {data.colorAnalysis.seasonalType}
              </Badge>
              <span className="text-sm text-slate-600">{data.colorAnalysis.colorHarmony}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {data.colorAnalysis.dominantColors.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-8 rounded-lg border border-slate-200 mb-1"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-slate-500">{color.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-lg">Style Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">A+</div>
              <p className="text-sm text-slate-600">Excellent color harmony potential</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Style Compatibility</span>
                <span className="font-semibold">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="colors" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Colors
              </TabsTrigger>
              <TabsTrigger value="style" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Style Guide
              </TabsTrigger>
              <TabsTrigger value="advice" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                Expert Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Your Style Personality</span>
                    </h3>
                    <p className="text-slate-700 leading-relaxed">{data.geminiInsights.personalityProfile}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Skin Tone Details</h4>
                    <p className="text-slate-700 leading-relaxed">{data.skinTone.description}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-4">Color Harmony Analysis</h4>
                    <div className="space-y-3">
                      {data.colorAnalysis.dominantColors.map((color, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-slate-900">{color.name}</span>
                              <span className="text-sm text-slate-600">{color.percentage}%</span>
                            </div>
                            <Progress value={color.percentage} className="h-1 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Recommended Color Palettes</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {data.geminiInsights.colorPairings.map((palette, index) => (
                      <Card key={index} className="border border-slate-200">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-slate-900 mb-4">Palette {index + 1}</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-8 h-8 rounded-lg border border-slate-200"
                                style={{ backgroundColor: palette.primary }}
                              />
                              <div>
                                <p className="text-sm font-medium">Primary</p>
                                <p className="text-xs text-slate-500">{palette.primary}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-8 h-8 rounded-lg border border-slate-200"
                                style={{ backgroundColor: palette.secondary }}
                              />
                              <div>
                                <p className="text-sm font-medium">Secondary</p>
                                <p className="text-xs text-slate-500">{palette.secondary}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-8 h-8 rounded-lg border border-slate-200"
                                style={{ backgroundColor: palette.accent }}
                              />
                              <div>
                                <p className="text-sm font-medium">Accent</p>
                                <p className="text-xs text-slate-500">{palette.accent}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Color Guidelines</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.colorAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                        <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-slate-700">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-8">
              <div className="grid gap-8">
                {data.geminiInsights.styleRecommendations.map((category, index) => (
                  <Card key={index} className="border border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-slate-600" />
                        <span>{category.category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-700 leading-relaxed">{category.reasoning}</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                            <div className="w-2 h-2 bg-slate-600 rounded-full" />
                            <span className="text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advice" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Professional Styling Advice</span>
                </h3>
                <div className="grid gap-4">
                  {data.geminiInsights.professionalAdvice.map((advice, index) => (
                    <Card key={index} className="border-l-4 border-l-slate-600 border-t-0 border-r-0 border-b-0">
                      <CardContent className="p-6">
                        <p className="text-slate-700 leading-relaxed">{advice}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
