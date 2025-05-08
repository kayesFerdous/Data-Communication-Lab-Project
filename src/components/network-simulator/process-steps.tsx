import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SimulationResult } from "@/types/network-simulator";
import { AlertCircle, ArrowDown, ArrowRight, CheckCircle2 } from "lucide-react";

interface ProcessStepsProps {
  result: SimulationResult;
  useHamming: boolean;
  useNoise: boolean;
}

export default function ProcessSteps({
  result,
  useHamming,
  useNoise,
}: ProcessStepsProps) {
  const formatBinary = (binary: string) => {
    return binary.match(/.{1,4}/g)?.join(" ") || binary;
  };

  return (
    <div className="space-y-6">
      {/* Sender Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Sender</h3>
          <Separator className="flex-1 ml-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Original Binary</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <code className="text-xs break-all">
                {formatBinary(result.binary)}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">
                Encoded Data {useHamming && "(with Hamming)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <code className="text-xs break-all">
                {formatBinary(result.encoded)}
              </code>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transmission Arrow */}
      <div className="flex justify-center py-2">
        <div className="flex flex-col items-center text-muted-foreground">
          <ArrowDown className="h-6 w-6" />
          <span className="text-sm">Transmission</span>
        </div>
      </div>

      {/* Receiver Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Receiver</h3>
          <Separator className="flex-1 ml-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useNoise && (
            <>
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Received Noisy Data</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <code className="text-xs break-all">
                    {formatBinary(result.noisy)}
                  </code>
                </CardContent>
              </Card>

              {result.flippedIndex !== null && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Error Detection</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error Detected</AlertTitle>
                      <AlertDescription>
                        Bit #{result.flippedIndex + 1} was flipped
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">
                Decoded Binary {useHamming && "(Error Corrected)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <code className="text-xs break-all">
                {formatBinary(result.outputBinary)}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Final Text Output</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="font-medium">{result.outputText}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
        <ArrowRight className="h-4 w-4 mr-2" />
        <span>
          Switch to the Signal Visualization tab to see the encoded signal
        </span>
      </div>
    </div>
  );
}
