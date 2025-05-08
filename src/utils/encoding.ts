// NRZ-L: 1 = high level (+1), 0 = low level (-1)
export function encodeNRZL2(binary: string): number[] {
  return binary.split("").map((bit) => (bit === "1" ? 1 : -1))
}

// Manchester: 1 = high-to-low transition, 0 = low-to-high transition
export function encodeManchester2(binary: string): number[] {
  const result: number[] = []

  for (const bit of binary) {
    if (bit === "1") {
      result.push(1) // First half of bit period
      result.push(-1) // Second half of bit period
    } else {
      result.push(-1) // First half of bit period
      result.push(1) // Second half of bit period
    }
  }

  return result
}

// NRZ-I: 1 = transition, 0 = no transition
export function encodeNRZI2(binary: string): number[] {
  const result: number[] = []
  let current = -1 // starting level

  for (const bit of binary) {
    if (bit === "1") {
      // For bit 1, toggle the signal level
      current = -current
    }
    // For bit 0, maintain the same signal level
    result.push(current)
  }

  return result
}

// AMI: 0 = zero level, 1 = alternating positive and negative
export function encodeAMI2(binary: string): number[] {
  const result: number[] = []
  let lastbit = -1

  for (const bit of binary) {
    if (bit === "0") result.push(0)
    else {
      lastbit = -lastbit
      result.push(lastbit)
    }
  }

  return result
}

// Differential Manchester: 0 = transition at start, 1 = no transition at start
export function encodeDifferentialManchester2(binary: string): number[] {
  const result: number[] = []
  let current = -1

  for (const bit of binary) {
    if (bit === "0") {
      result.push(-current) // Transition at start
      result.push(current) // Mid-bit transition
    } else {
      result.push(current) // No transition at start
      current = -current // Mid-bit transition
      result.push(current)
    }
  }

  return result
}

