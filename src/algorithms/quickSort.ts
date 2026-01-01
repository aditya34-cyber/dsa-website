import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateQuickSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data];

  steps.push({
    type: 'highlight',
    indices: [],
    description: 'Starting Quick Sort algorithm',
    theory: 'Quick Sort uses a divide-and-conquer approach. It picks a pivot element and partitions the array around it.',
    complexity: 'Average Time: O(n log n), Worst Time: O(n²), Space: O(log n)'
  });

  const quickSort = (start: number, end: number, depth: number = 0) => {
    if (start >= end) return;

    const pivotIndex = partition(start, end, depth);
    
    steps.push({
      type: 'highlight',
      indices: [pivotIndex],
      description: `Pivot ${arr[pivotIndex]} is now in its correct position`,
      theory: `After partitioning, the pivot is in its final sorted position. All elements to the left are smaller, all elements to the right are larger.`,
      complexity: 'Average Time: O(n log n), Space: O(log n)'
    });

    // Recursively sort left and right subarrays
    quickSort(start, pivotIndex - 1, depth + 1);
    quickSort(pivotIndex + 1, end, depth + 1);
  };

  const partition = (start: number, end: number, depth: number): number => {
    const pivot = arr[end];
    
    steps.push({
      type: 'highlight',
      indices: [end],
      description: `Choosing ${pivot} as pivot (rightmost element)`,
      theory: `The pivot element divides the array. We'll rearrange elements so all smaller elements are on the left, larger on the right.`,
      complexity: 'Partitioning takes O(n) time'
    });

    let i = start - 1;

    for (let j = start; j < end; j++) {
      steps.push({
        type: 'compare',
        indices: [j, end],
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        theory: `If current element is smaller than or equal to pivot, it should be on the left side of the final arrangement.`,
        complexity: 'Each comparison is O(1)'
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'swap',
            indices: [i, j],
            description: `Swapping ${arr[j]} and ${arr[i]} to move smaller element left`,
            theory: `Moving the smaller element to the left partition to maintain the invariant.`,
            complexity: 'Swap operation is O(1)'
          });
        }
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[end]] = [arr[end], arr[i + 1]];
    steps.push({
      type: 'swap',
      indices: [i + 1, end],
      description: `Placing pivot ${pivot} in its correct position`,
      theory: `The pivot now divides the array: elements ≤ ${pivot} on the left, elements > ${pivot} on the right.`,
      complexity: 'Pivot placement is O(1)'
    });

    return i + 1;
  };

  quickSort(0, arr.length - 1);

  steps.push({
    type: 'complete',
    description: 'Quick Sort completed! Array is now sorted.',
    theory: 'Quick Sort has successfully divided the problem into smaller subproblems and solved them recursively. The array is now completely sorted.',
    complexity: 'Final Average Time: O(n log n), Space: O(log n)'
  });

  return steps;
};