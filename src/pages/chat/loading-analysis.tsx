"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Palette, Brain, Sparkles, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export function LoadingAnalysis() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { icon: Palette, label: "Analyzing skin tone and undertones", duration: 1000 },
    { icon: Brain, label: "Processing color harmony patterns", duration: 1500 },
    { icon: TrendingUp, label: "Generating style recommendations", duration: 1000 },
    { icon: Sparkles, label: "Finalizing personalized insights", duration: 500 },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 80)

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [])

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-slate-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Professional Analysis in Progress</h3>
            <p className="text-slate-600">
              Our AI is carefully analyzing your image to provide the most accurate recommendations
            </p>
          </div>

          <div className="space-y-6">
            <Progress value={progress} className="h-3 bg-slate-100" />
            <div className="text-sm text-slate-500">{Math.round(progress)}% Complete</div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${isActive ? "bg-slate-50 border border-slate-200" : ""
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                        ? "bg-green-100 text-green-600"
                        : isActive
                          ? "bg-slate-100 text-slate-600"
                          : "bg-slate-50 text-slate-400"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`font-medium transition-colors ${isActive ? "text-slate-900" : isCompleted ? "text-green-600" : "text-slate-500"
                      }`}
                  >
                    {step.label}
                  </span>
                  {isCompleted && <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>}
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
