import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateBubbleSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data]; // ✅ local copy
  const n = arr.length;

  steps.push({
    type: "highlight",
    indices: [],
    array: [...arr],
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
        array: [...arr],
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        theory:
          "Adjacent elements are compared to check if they are in the correct order.",
      });

      if (arr[j] > arr[j + 1]) {
        // ✅ swap in local array
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        steps.push({
          type: "swap",
          indices: [j, j + 1],
          array: [...arr], // ✅ snapshot AFTER swap
          description: `Swapping ${arr[j + 1]} and ${arr[j]}`,
          theory:
            "Since the left element is larger, the elements are swapped.",
        });
      }
    }
  }

  steps.push({
    type: "complete",
    array: [...arr],
    description: "Bubble Sort completed!",
    theory: "All elements are now sorted.",
  });

  return steps;
};
