import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateBubbleSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const n = data.length;

  steps.push({
    type: "highlight",
    indices: [],
    description: "Starting Bubble Sort algorithm",
    theory:
      "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order.",
    complexity: "Time: O(n²), Space: O(1)",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: "compare",
        indices: [j, j + 1],
        description: `Comparing ${data[j]} and ${data[j + 1]}`,
        theory:
          "Adjacent elements are compared to check if they are in the correct order.",
      });

      if (data[j] > data[j + 1]) {
        steps.push({
          type: "swap",
          indices: [j, j + 1],
          description: `Swapping ${data[j]} and ${data[j + 1]}`,
          theory:
            "Since the left element is larger, a swap is required.",
        });

        // IMPORTANT: swap ONLY in data copy used for comparison
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
      }
    }
  }

  steps.push({
    type: "complete",
    description: "Bubble Sort completed!",
    theory: "All elements are now sorted.",
  });

  return steps;
};
