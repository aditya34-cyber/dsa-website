import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateBubbleSortSteps } from "@/algorithms/bubbleSort";
import { generateQuickSortSteps } from "@/algorithms/quickSort";
import { generateSelectionSortSteps } from "@/algorithms/selectionSort";
import { generateMergeSortSteps } from "@/algorithms/mergeSort";
import { Button } from "@/components/ui/button";

const SortingVisualization = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bubble' | 'quick' | 'selection' | 'merge'>('bubble');
  const [currentData] = useState(() => 
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
  );

  const algorithms = {
    bubble: {
      title: "Bubble Sort Visualization",
      generateSteps: generateBubbleSortSteps,
      description: "Repeatedly compares adjacent elements and swaps them if in wrong order. O(n²)"
    },
    quick: {
      title: "Quick Sort Visualization", 
      generateSteps: generateQuickSortSteps,
      description: "Divides array around a pivot, recursively sorting partitions. O(n log n)"
    },
    selection: {
      title: "Selection Sort Visualization",
      generateSteps: generateSelectionSortSteps,
      description: "Finds minimum element and places it at the beginning, repeating for unsorted portion. O(n²)"
    },
    merge: {
      title: "Merge Sort Visualization",
      generateSteps: generateMergeSortSteps,
      description: "Divides array into halves, recursively sorts, then merges sorted halves. O(n log n)"
    }
  };

  const currentAlg = algorithms[selectedAlgorithm];
  const steps = currentAlg.generateSteps(currentData);

  const renderSortElement = (value: number, index: number, isHighlighted: boolean, isComparing: boolean) => (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="flex items-end justify-center p-2 min-w-[50px] text-white font-bold text-sm rounded-t transition-all duration-300"
        style={{ 
          height: `${(value / 100) * 200 + 40}px`,
          backgroundColor: isComparing ? 'hsl(var(--destructive))' : 
                          isHighlighted ? 'hsl(var(--primary))' : 
                          'hsl(var(--muted-foreground))'
        }}
      >
        {value}
      </div>
      <span className="text-xs text-muted-foreground">{index}</span>
    </div>
  );

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Algorithm Selection */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Algorithm:</span>
          <Button
            size="sm"
            variant={selectedAlgorithm === 'bubble' ? 'default' : 'outline'}
            onClick={() => setSelectedAlgorithm('bubble')}
          >
            Bubble
          </Button>
          <Button
            size="sm"
            variant={selectedAlgorithm === 'selection' ? 'default' : 'outline'}
            onClick={() => setSelectedAlgorithm('selection')}
          >
            Selection
          </Button>
          <Button
            size="sm"
            variant={selectedAlgorithm === 'quick' ? 'default' : 'outline'}
            onClick={() => setSelectedAlgorithm('quick')}
          >
            Quick
          </Button>
          <Button
            size="sm"
            variant={selectedAlgorithm === 'merge' ? 'default' : 'outline'}
            onClick={() => setSelectedAlgorithm('merge')}
          >
            Merge
          </Button>
          <span className="text-xs text-muted-foreground ml-2 max-w-md">{currentAlg.description}</span>
        </div>

        {/* Visualizer */}
        <AlgorithmVisualizer
          title={currentAlg.title}
          initialData={currentData}
          steps={steps}
          onGenerateSteps={currentAlg.generateSteps}
          renderElement={renderSortElement}
          algorithmType="sorting"
        />
      </div>
    </div>
  );
};

export default SortingVisualization;
