import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateMergeSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data];

  steps.push({
    type: 'start',
    indices: [],
    values: [...arr],
    description: `Starting Merge Sort with array: [${arr.join(', ')}]`,
    theory: "Merge Sort uses divide-and-conquer: it divides the array into halves, recursively sorts them, then merges the sorted halves back together.",
    complexity: "Time: O(n log n) | Space: O(n)"
  });

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({
      type: 'highlight',
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      values: [...arr],
      description: `Merging subarrays [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`,
      theory: "The merge operation combines two sorted subarrays into one sorted array by comparing elements one by one.",
      complexity: "Time: O(n log n) | Space: O(n)"
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        values: [...arr],
        description: `Comparing ${leftArr[i]} from left subarray with ${rightArr[j]} from right subarray`,
        theory: "We compare the front elements of both subarrays and place the smaller one into the result.",
        complexity: "Time: O(n log n) | Space: O(n)"
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        type: 'highlight',
        indices: [k],
        values: [...arr],
        description: `Placed ${arr[k]} at index ${k}`,
        theory: "The smaller element is placed in its correct position in the merged array.",
        complexity: "Time: O(n log n) | Space: O(n)"
      });
      
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: 'highlight',
        indices: [k],
        values: [...arr],
        description: `Copying remaining element ${arr[k]} from left subarray`,
        theory: "When one subarray is exhausted, we copy all remaining elements from the other subarray.",
        complexity: "Time: O(n log n) | Space: O(n)"
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: 'highlight',
        indices: [k],
        values: [...arr],
        description: `Copying remaining element ${arr[k]} from right subarray`,
        theory: "When one subarray is exhausted, we copy all remaining elements from the other subarray.",
        complexity: "Time: O(n log n) | Space: O(n)"
      });
      j++;
      k++;
    }
  };

  const mergeSort = (left: number, right: number, depth: number = 0) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'highlight',
        indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        values: [...arr],
        description: `Dividing array from index ${left} to ${right} at midpoint ${mid}`,
        theory: `Recursion depth ${depth}: We split the problem in half. This divide step is what gives Merge Sort its O(log n) factor.`,
        complexity: "Time: O(n log n) | Space: O(n)"
      });

      mergeSort(left, mid, depth + 1);
      mergeSort(mid + 1, right, depth + 1);
      merge(left, mid, right);
    }
  };

  mergeSort(0, arr.length - 1);

  steps.push({
    type: 'complete',
    indices: [],
    values: [...arr],
    description: `Array sorted: [${arr.join(', ')}]`,
    theory: "Merge Sort complete! The array was recursively divided and merged back together in sorted order.",
    complexity: "Time: O(n log n) | Space: O(n)"
  });

  return steps;
};
