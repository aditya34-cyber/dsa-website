import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateBubbleSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data];
  const n = arr.length;

  steps.push({
    type: 'highlight',
    indices: [],
    description: 'Starting Bubble Sort algorithm',
    theory: 'Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. This process is repeated until the array is sorted.',
    complexity: 'Time: O(n²), Space: O(1)'
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      type: 'highlight',
      indices: [i],
      description: `Pass ${i + 1}: Looking for the ${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} largest element`,
      theory: `In each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.`,
      complexity: 'Time: O(n²), Space: O(1)'
    });

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}`,
        theory: `We compare adjacent elements. If arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]}), we need to swap them.`,
        complexity: 'Time: O(n²), Space: O(1)'
      });

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `Swapping ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} < ${arr[j]}`,
          theory: 'When the left element is greater than the right element, we swap them to maintain the sorting order.',
          complexity: 'Time: O(n²), Space: O(1)'
        });
      } else {
        steps.push({
          type: 'highlight',
          indices: [j, j + 1],
          description: `No swap needed: ${arr[j]} ≤ ${arr[j + 1]}`,
          theory: 'Elements are already in correct order, so we continue to the next pair.',
          complexity: 'Time: O(n²), Space: O(1)'
        });
      }
    }

    steps.push({
      type: 'highlight',
      indices: [n - i - 1],
      description: `Element ${arr[n - i - 1]} is now in its correct position`,
      theory: `After each pass, one more element reaches its final sorted position. The largest element has "bubbled up" to the end.`,
      complexity: 'Time: O(n²), Space: O(1)'
    });
  }

  steps.push({
    type: 'complete',
    description: 'Bubble Sort completed! Array is now sorted.',
    theory: 'All elements are now in their correct positions. Bubble Sort has successfully sorted the array by repeatedly comparing and swapping adjacent elements.',
    complexity: 'Final Time Complexity: O(n²), Space Complexity: O(1)'
  });

  return steps;
};