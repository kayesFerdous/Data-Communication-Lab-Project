"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EncodingType } from "@/types/network-simulator"
import { ChevronLeft, ChevronRight, Pause, Play, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface SignalVisualizationProps {
  signal: number[]
  originalBits: string
  encoding: EncodingType
}

export default function SignalVisualization({ signal, originalBits, encoding }: SignalVisualizationProps) {
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(2)
  const [animationId, setAnimationId] = useState<NodeJS.Timeout | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  // Determine if the encoding uses 2 values per bit
  const isDoubleRate = encoding === "Manchester" || encoding === "Differential Manchester"

  // Reset animation when signal changes
  useEffect(() => {
    if (signal.length > 0) {
      setAnimationProgress(signal.length)
      setIsPlaying(false)
      setScrollPosition(0)
    }

    return () => {
      if (animationId) {
        clearTimeout(animationId)
      }
    }
  }, [signal, encoding])

  // Animation effect
  useEffect(() => {
    if (!isPlaying) return

    if (animationProgress < signal.length) {
      const timeout = setTimeout(() => {
        setAnimationProgress((prev) => prev + 1)
      }, 500 / speed)

      setAnimationId(timeout)

      return () => {
        clearTimeout(timeout)
      }
    } else {
      setIsPlaying(false)
    }
  }, [isPlaying, animationProgress, speed, signal.length])

  // Handle scroll position changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollPosition
    }
  }, [scrollPosition])

  const handlePlay = () => {
    if (animationProgress >= signal.length) {
      setAnimationProgress(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    if (animationId) {
      clearTimeout(animationId)
      setAnimationId(null)
    }
    setAnimationProgress(0)
    setIsPlaying(false)
  }

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200))
  }

  const handleScrollRight = () => {
    if (containerRef.current) {
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth
      setScrollPosition(Math.min(maxScroll, scrollPosition + 200))
    }
  }

  if (!signal || signal.length === 0) return null

  // Simplified visualization parameters
  const bitWidth = 40
  const lineHeight = 40
  const padding = 20
  const graphHeight = 80
  const svgHeight = 180 // Increased from 150
  const baseline = padding + graphHeight / 2
  const svgWidth = Math.max(600, signal.length * bitWidth)

  // Get the appropriate color for a signal value
  // const getSignalColor = (value: number) => {
  //   return value === 0 ? "#9ca3af" : "#3b82f6"
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signal Representation ({encoding})</CardTitle>
        <CardDescription>Visual representation of the encoded signal with corresponding bit values.</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handlePlay} className="flex items-center gap-1">
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="speed" className="text-sm">
              Speed:
            </Label>
            <Select value={speed.toString()} onValueChange={(val) => setSpeed(Number(val))}>
              <SelectTrigger id="speed" className="w-24 h-8">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">Very Slow</SelectItem>
                <SelectItem value="1">Slow</SelectItem>
                <SelectItem value="2">Normal</SelectItem>
                <SelectItem value="4">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500"></div>
              <span>+1</span>
            </div>
            {encoding === "AMI" && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500"></div>
                <span>0</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500"></div>
              <span>-1</span>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mb-2">
            <Button size="sm" variant="outline" onClick={handleScrollLeft}>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">Scroll Left</span>
            </Button>
            <Button size="sm" variant="outline" onClick={handleScrollRight}>
              <span className="mr-1">Scroll Right</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div
            ref={containerRef}
            className="mt-2 overflow-x-auto pb-2 border rounded-lg p-4 relative"
            style={{ maxWidth: "100%" }}
          >
            <svg width={svgWidth} height={svgHeight}>
              {/* Horizontal reference lines */}
              <line
                x1="0"
                y1={baseline - lineHeight}
                x2={svgWidth}
                y2={baseline - lineHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1={baseline}
                x2={svgWidth}
                y2={baseline}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <line
                x1="0"
                y1={baseline + lineHeight}
                x2={svgWidth}
                y2={baseline + lineHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
              />

              {/* Y-axis labels */}
              <text x="5" y={baseline - lineHeight - 5} fontSize="12" fill="#6b7280">
                +1
              </text>
              <text x="5" y={baseline - 5} fontSize="12" fill="#6b7280">
                0
              </text>
              <text x="5" y={baseline + lineHeight - 5} fontSize="12" fill="#6b7280">
                -1
              </text>

              {/* Signal path - simplified direct plotting */}
              <polyline
                points={
                  signal
                    .slice(0, animationProgress)
                    .map((value, index) => {
                      const x = index * bitWidth
                      // Map signal values directly to y coordinates
                      let y
                      if (value === 1)
                        y = baseline - lineHeight // +1 level
                      else if (value === -1)
                        y = baseline + lineHeight // -1 level
                      else y = baseline // 0 level

                      // For each point, we need two coordinates to create horizontal lines
                      if (index === 0) {
                        return `${x},${y}`
                      } else {
                        const prevValue = signal[index - 1]
                        let prevY
                        if (prevValue === 1) prevY = baseline - lineHeight
                        else if (prevValue === -1) prevY = baseline + lineHeight
                        else prevY = baseline

                        // If there's a transition, we need to add a vertical line
                        if (prevY !== y) {
                          return `${x},${prevY} ${x},${y}`
                        } else {
                          return `${x},${y}`
                        }
                      }
                    })
                    .join(" ") +
                  (animationProgress > 0
                    ? ` ${animationProgress * bitWidth},${signal[animationProgress - 1] === 1
                      ? baseline - lineHeight
                      : signal[animationProgress - 1] === -1
                        ? baseline + lineHeight
                        : baseline
                    }`
                    : "")
                }
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
              />

              {/* Vertical grid lines and bit numbers */}
              {signal.map((_, i) => (
                <g key={i}>
                  <line
                    x1={i * bitWidth}
                    y1={padding - 10}
                    x2={i * bitWidth}
                    y2={padding + graphHeight + 10}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  {/* Show index numbers more prominently */}
                  {i % 5 === 0 && (
                    <text
                      x={i * bitWidth + bitWidth / 2}
                      y={padding + graphHeight + 25}
                      fontSize="12"
                      fill="#4b5563"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {i}
                    </text>
                  )}
                </g>
              ))}

              {/* Add a clear x-axis label */}
              <text
                x={svgWidth / 2}
                y={padding + graphHeight + 45}
                fontSize="12"
                fill="#4b5563"
                textAnchor="middle"
                fontWeight="bold"
              >
                Signal Position
              </text>

              {originalBits.split("").map((bit, index) => {
                // For double-rate encodings, each bit takes 2 signal points
                const x = isDoubleRate ? index * 2 * bitWidth + bitWidth : index * bitWidth + bitWidth / 2
                // Only show bits up to the animation progress
                if ((isDoubleRate && index * 2 < animationProgress) || (!isDoubleRate && index < animationProgress)) {
                  return (
                    <text
                      key={index}
                      x={x}
                      y={padding + graphHeight + 65}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill={bit === "1" ? "#2563eb" : "#dc2626"}
                    >
                      {bit}
                    </text>
                  )
                }
                return null
              })}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

