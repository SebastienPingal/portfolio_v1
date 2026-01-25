/**
 * 📈 Logistic Map Formula: x_{n+1} = r * x_n * (1 - x_n)
 * 
 * @param x - The current value (usually between 0 and 1)
 * @param r - The growth rate (usually between 0 and 4)
 * @returns The next value in the sequence
 */
export const logisticMap = (x: number, r: number): number => {
  return r * x * (1 - x)
}

/**
 * 🔄 Generates a sequence of values using the logistic map
 * 
 * @param x0 - The initial value
 * @param r - The growth rate
 * @param iterations - Number of iterations to perform
 * @returns An array of values in the sequence
 */
export const generateLogisticSequence = (x0: number, r: number, iterations: number): number[] => {
  const sequence: number[] = [x0]
  let currentX = x0
  
  for (let i = 0; i < iterations; i++) {
    currentX = logisticMap(currentX, r)
    sequence.push(currentX)
  }
  
  return sequence
}
