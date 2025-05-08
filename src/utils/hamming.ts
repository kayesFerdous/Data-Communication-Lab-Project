export function encodeHamming(data8: string): string {
  const d = data8.split('').map(Number);
  const p = [];

  p[0] = d[0] ^ d[1] ^ d[3] ^ d[4] ^ d[6];
  p[1] = d[0] ^ d[2] ^ d[3] ^ d[5] ^ d[6];
  p[2] = d[1] ^ d[2] ^ d[3] ^ d[7];
  p[3] = d[4] ^ d[5] ^ d[6] ^ d[7];

  return [p[0], p[1], d[0], p[2], d[1], d[2], d[3], p[3], d[4], d[5], d[6], d[7]].join('');
}

export function decodeHamming(hamming12: string): { corrected: string; errorPos: number | null } {
  const b = hamming12.split('').map(Number);
  const s1 = b[0] ^ b[2] ^ b[4] ^ b[6] ^ b[8] ^ b[10];
  const s2 = b[1] ^ b[2] ^ b[5] ^ b[6] ^ b[9] ^ b[10];
  const s4 = b[3] ^ b[4] ^ b[5] ^ b[6] ^ b[11];
  const s8 = b[7] ^ b[8] ^ b[9] ^ b[10] ^ b[11];
  const syndrome = s1 + (s2 << 1) + (s4 << 2) + (s8 << 3);

  if (syndrome > 0 && syndrome <= 12) {
    b[syndrome - 1] ^= 1; // correct the bit
  }

  const corrected = [b[2], b[4], b[5], b[6], b[8], b[9], b[10], b[11]].join('');
  return { corrected, errorPos: syndrome > 0 ? syndrome : null };
}

