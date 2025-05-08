export type EncodingType = "NRZ-L" | "Manchester" | "NRZ-I" | "AMI" | "Differential Manchester"

export interface SimulationResult {
  binary: string
  encoded: string
  noisy: string
  flippedIndex: number | null
  outputBinary: string
  outputText: string
  signal: number[]
}

