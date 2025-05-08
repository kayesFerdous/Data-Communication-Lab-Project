"use client"

import { useState } from "react"
import { textToBinary, binaryToText } from "../utils/binary"
import { encodeHamming, decodeHamming } from "../utils/hamming"
import {
  encodeNRZL2,
  encodeManchester2,
  encodeNRZI2,
  encodeAMI2,
  encodeDifferentialManchester2,
} from "../utils/encoding"
import { injectNoise } from "../utils/noise"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2 } from "lucide-react"
import InputSection from "@/components/network-simulator/input-section"
import ProcessSteps from "@/components/network-simulator/process-steps"
import SignalVisualization from "@/components/network-simulator/signal-visualization"
import type { EncodingType, SimulationResult } from "@/types/network-simulator"

export default function Home() {
  const [text, setText] = useState("")
  const [encoding, setEncoding] = useState<EncodingType>("NRZ-L")
  const [useNoise, setUseNoise] = useState(false)
  const [useHamming, setUseHamming] = useState(true)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [signal, setSignal] = useState<number[]>([])
  const [originalBits, setOriginalBits] = useState<string>("")

  const simulate = () => {
    if (!text.trim()) return

    setIsSimulating(true)

    // Simulate a small delay to show processing
    setTimeout(() => {
      const binary = textToBinary(text)
      const blocks = binary.match(/.{1,8}/g) || []

      const encodedBlocks = blocks.map((b) => (useHamming ? encodeHamming(b) : b)).join("")

      let noisy = encodedBlocks
      let flippedIndex = null
      if (useNoise) {
        const res = injectNoise(encodedBlocks)
        noisy = res.result
        flippedIndex = res.flippedIndex
      }

      const correctedBlocks = (noisy.match(/.{1,12}/g) || []).map((b) => (useHamming ? decodeHamming(b).corrected : b))

      const outputBinary = correctedBlocks.join("")
      const outputText = binaryToText(outputBinary)

      // Select the appropriate encoding function based on the selected encoding type
      let encodedSignal: number[]
      switch (encoding) {
        case "NRZ-L":
          encodedSignal = encodeNRZL2(encodedBlocks)
          console.log(encodedSignal);
          break
        case "Manchester":
          encodedSignal = encodeManchester2(encodedBlocks)
          break
        case "NRZ-I":
          encodedSignal = encodeNRZI2(encodedBlocks)
          break
        case "AMI":
          encodedSignal = encodeAMI2(encodedBlocks)
          break
        case "Differential Manchester":
          encodedSignal = encodeDifferentialManchester2(encodedBlocks)
          break
        default:
          encodedSignal = encodeNRZL2(encodedBlocks)
      }

      // Debug the signal
      console.log(`Encoding: ${encoding}`)
      console.log(`Encoded blocks: ${encodedBlocks}`)
      console.log(`Signal: ${encodedSignal}`)

      // Store the original bits for display under the waveform
      setOriginalBits(encodedBlocks) // Use encodedBlocks instead of binary

      const newResult = {
        binary,
        encoded: encodedBlocks,
        noisy,
        flippedIndex,
        outputBinary,
        outputText,
        signal: encodedSignal,
      }

      setResult(newResult)
      setSignal(encodedSignal)
      setIsSimulating(false)
    }, 500)
  }

  return (
    <main className="container mx-auto py-6 px-4 max-w-5xl">
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Mini Network Protocol Simulator</h1>
          <p className="text-muted-foreground mt-2">
            Simulate data transmission with different encoding schemes and error correction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input Section */}
          <InputSection
            text={text}
            setText={setText}
            encoding={encoding}
            setEncoding={setEncoding}
            useNoise={useNoise}
            setUseNoise={setUseNoise}
            useHamming={useHamming}
            setUseHamming={setUseHamming}
            onSimulate={simulate}
            isSimulating={isSimulating}
          />

          {/* Output Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code2 className="mr-2 h-5 w-5" />
                Simulation Results
              </CardTitle>
              <CardDescription>View the transmission process and results</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p>Enter text and click "Simulate Transmission" to see results</p>
                </div>
              ) : (
                <Tabs defaultValue="process" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="process">Process Steps</TabsTrigger>
                    <TabsTrigger value="visual">Signal Visualization</TabsTrigger>
                  </TabsList>

                  <TabsContent value="process" className="space-y-6 mt-4">
                    <ProcessSteps result={result} useHamming={useHamming} useNoise={useNoise} />
                  </TabsContent>

                  <TabsContent value="visual" className="mt-4">
                    <SignalVisualization signal={signal} originalBits={originalBits} encoding={encoding} />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

