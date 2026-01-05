import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateSelectionSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data];
  const n = arr.length;

  steps.push({
    type: 'start',
    indices: [],
    values: [...arr],
    description: `Starting Selection Sort with array: [${arr.join(', ')}]`,
    theory: "Selection Sort divides the array into sorted and unsorted regions. It repeatedly finds the minimum element from the unsorted region and moves it to the sorted region.",
    complexity: "Time: O(n²) | Space: O(1)"
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      values: [...arr],
      description: `Looking for minimum element starting from index ${i}`,
      theory: `The sorted region is indices 0 to ${i - 1}. Now searching for the minimum in the unsorted region.`,
      complexity: "Time: O(n²) | Space: O(1)"
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        indices: [minIdx, j],
        values: [...arr],
        description: `Comparing current minimum ${arr[minIdx]} at index ${minIdx} with ${arr[j]} at index ${j}`,
        theory: "We compare each element with the current minimum to find the smallest element in the unsorted portion.",
        complexity: "Time: O(n²) | Space: O(1)"
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          type: 'highlight',
          indices: [minIdx],
          values: [...arr],
          description: `Found new minimum ${arr[minIdx]} at index ${minIdx}`,
          theory: "When we find a smaller element, we update our minimum index to track it.",
          complexity: "Time: O(n²) | Space: O(1)"
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIdx],
        values: [...arr],
        description: `Swapping ${arr[i]} at index ${i} with minimum ${arr[minIdx]} at index ${minIdx}`,
        theory: "After finding the minimum, we swap it with the first element of the unsorted region, extending the sorted region by one.",
        complexity: "Time: O(n²) | Space: O(1)"
      });

      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  steps.push({
    type: 'complete',
    indices: [],
    values: [...arr],
    description: `Array sorted: [${arr.join(', ')}]`,
    theory: "Selection Sort complete! The algorithm made n-1 passes, each time selecting the minimum from the remaining unsorted elements.",
    complexity: "Time: O(n²) | Space: O(1)"
  });

  return steps;
};
