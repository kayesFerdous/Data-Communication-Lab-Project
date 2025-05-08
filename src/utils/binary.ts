export const textToBinary = (text: string): string => {
  return [...text].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
};

export const binaryToText = (binary: string): string => {
  const chars = binary.match(/.{1,8}/g) || [];
  return chars.map(b => String.fromCharCode(parseInt(b, 2))).join('');
};

