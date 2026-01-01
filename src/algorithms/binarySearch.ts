import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateBinarySearchSteps = (data: number[], target: number): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data]; // Use the already sorted array as-is
  let left = 0;
  let right = arr.length - 1;
  let found = false;

  steps.push({
    type: 'highlight',
    indices: [],
    description: `Starting Binary Search for target value: ${target}`,
    theory: 'Binary Search works on sorted arrays by repeatedly dividing the search space in half. It compares the target with the middle element.',
    complexity: 'Time: O(log n), Space: O(1)'
  });

  steps.push({
    type: 'highlight',
    indices: Array.from({length: right - left + 1}, (_, i) => left + i),
    description: 'Initial search range: entire sorted array',
    theory: `We start with the full array range from index ${left} to ${right}. The array must be sorted for binary search to work correctly.`,
    complexity: 'Time: O(log n), Space: O(1)'
  });

  while (left <= right && !found) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      type: 'highlight',
      indices: [mid],
      description: `Checking middle element at index ${mid}: ${arr[mid]}`,
      theory: `Calculate middle index: (${left} + ${right}) / 2 = ${mid}. Compare arr[${mid}] = ${arr[mid]} with target ${target}.`,
      complexity: 'Finding middle takes O(1) time'
    });

    if (arr[mid] === target) {
      steps.push({
        type: 'highlight',
        indices: [mid],
        description: `Found target ${target} at index ${mid}!`,
        theory: `Target found! The value ${target} is located at index ${mid}. Binary search successfully located the element.`,
        complexity: 'Search completed in O(log n) time'
      });
      found = true;
    } else if (arr[mid] < target) {
      steps.push({
        type: 'compare',
        indices: [mid],
        description: `${arr[mid]} < ${target}, search in right half`,
        theory: `Since ${arr[mid]} is less than ${target}, and the array is sorted, the target must be in the right half if it exists.`,
        complexity: 'Eliminating half the search space'
      });
      left = mid + 1;
      
      if (left <= right) {
        steps.push({
          type: 'highlight',
          indices: Array.from({length: right - left + 1}, (_, i) => left + i),
          description: `New search range: indices ${left} to ${right}`,
          theory: `Update left boundary to ${left}. The search space is now reduced by half.`,
          complexity: 'Each iteration reduces search space by half'
        });
      }
    } else {
      steps.push({
        type: 'compare',
        indices: [mid],
        description: `${arr[mid]} > ${target}, search in left half`,
        theory: `Since ${arr[mid]} is greater than ${target}, and the array is sorted, the target must be in the left half if it exists.`,
        complexity: 'Eliminating half the search space'
      });
      right = mid - 1;
      
      if (left <= right) {
        steps.push({
          type: 'highlight',
          indices: Array.from({length: right - left + 1}, (_, i) => left + i),
          description: `New search range: indices ${left} to ${right}`,
          theory: `Update right boundary to ${right}. The search space is now reduced by half.`,
          complexity: 'Each iteration reduces search space by half'
        });
      }
    }
  }

  if (!found) {
    steps.push({
      type: 'complete',
      description: `Target ${target} not found in the array`,
      theory: `The search space has been exhausted. The target value ${target} does not exist in this sorted array.`,
      complexity: 'Search completed in O(log n) time'
    });
  } else {
    steps.push({
      type: 'complete',
      description: `Binary Search completed successfully!`,
      theory: `Binary search found the target efficiently by eliminating half of the remaining elements in each step.`,
      complexity: 'Final Time Complexity: O(log n), Space: O(1)'
    });
  }

  return steps;
};