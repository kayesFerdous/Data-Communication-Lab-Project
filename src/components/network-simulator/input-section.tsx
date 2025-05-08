import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { EncodingType } from "@/types/network-simulator"
import { FileText, Wand2 } from 'lucide-react'

interface InputSectionProps {
  text: string
  setText: (text: string) => void
  encoding: EncodingType
  setEncoding: (encoding: EncodingType) => void
  useNoise: boolean
  setUseNoise: (useNoise: boolean) => void
  useHamming: boolean
  setUseHamming: (useHamming: boolean) => void
  onSimulate: () => void
  isSimulating: boolean
}

export default function InputSection({
  text,
  setText,
  encoding,
  setEncoding,
  useNoise,
  setUseNoise,
  useHamming,
  setUseHamming,
  onSimulate,
  isSimulating,
}: InputSectionProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Input Data
        </CardTitle>
        <CardDescription>Enter text to simulate transmission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to transmit..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="encoding">Encoding Scheme</Label>
          <Select value={encoding} onValueChange={(value) => setEncoding(value as EncodingType)}>
            <SelectTrigger id="encoding">
              <SelectValue placeholder="Select encoding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NRZ-L">NRZ-L</SelectItem>
              <SelectItem value="NRZ-I">NRZ-I</SelectItem>
              <SelectItem value="Manchester">Manchester</SelectItem>
              <SelectItem value="Differential Manchester">Differential Manchester</SelectItem>
              <SelectItem value="AMI">AMI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="noise" className="flex-1">
            Simulate Noise
          </Label>
          <Switch id="noise" checked={useNoise} onCheckedChange={setUseNoise} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="hamming" className="flex-1">
            Use Hamming Code
          </Label>
          <Switch id="hamming" checked={useHamming} onCheckedChange={setUseHamming} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSimulate} className="w-full" disabled={isSimulating || !text.trim()}>
          {isSimulating ? "Simulating..." : "Simulate Transmission"}
          {!isSimulating && <Wand2 className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

