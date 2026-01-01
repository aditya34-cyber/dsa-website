import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export const generateQuickSortSteps = (data: number[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  const arr = [...data];

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      type: "highlight",
      indices: [high],
      description: `Choosing pivot ${pivot}`,
      theory: "Pivot is used to partition the array.",
    });

    for (let j = low; j < high; j++) {
      steps.push({
        type: "compare",
        indices: [j, high],
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        theory: "Check if element should go left of pivot.",
      });

      if (arr[j] < pivot) {
        i++;

        if (i !== j) {
          steps.push({
            type: "swap",
            indices: [i, j],
            description: `Swapping ${arr[i]} and ${arr[j]}`,
            theory: "Smaller element moved left.",
          });

          // Maintain internal state ONLY
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    steps.push({
      type: "swap",
      indices: [i + 1, high],
      description: `Placing pivot ${pivot} correctly`,
      theory: "Pivot moves to its final position.",
    });

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
  };

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  quickSort(0, arr.length - 1);

  steps.push({
    type: "complete",
    description: "Quick Sort completed!",
    theory: "Array has been sorted using divide and conquer.",
  });

  return steps;
};
