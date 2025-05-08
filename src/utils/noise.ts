export function injectNoise(binary: string): { result: string; flippedIndex: number } {
  const i = Math.floor(Math.random() * binary.length);
  const flipped = binary[i] === '0' ? '1' : '0';
  return {
    result: binary.substring(0, i) + flipped + binary.substring(i + 1),
    flippedIndex: i
  };
}

