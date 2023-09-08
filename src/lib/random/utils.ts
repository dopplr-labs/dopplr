export function simpleHash(value: number) {
  const prime = 101
  return (value * 73 + 47) % prime
}
