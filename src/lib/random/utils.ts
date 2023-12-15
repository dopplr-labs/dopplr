export function simpleHash(value: number) {
  // operation with prime numbers to generate a simple hash
  return (value * 73 + 47) % 101
}
