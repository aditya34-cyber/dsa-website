import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateBubbleSortSteps } from "@/algorithms/bubbleSort";
import { generateQuickSortSteps } from "@/algorithms/quickSort";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SortingVisualization = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bubble' | 'quick'>('bubble');
  const [currentData] = useState(() => 
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
  );

  const algorithms = {
    bubble: {
      title: "Bubble Sort Visualization",
      generateSteps: generateBubbleSortSteps,
      description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
    },
    quick: {
      title: "Quick Sort Visualization", 
      generateSteps: generateQuickSortSteps,
      description: "Quick Sort is a highly efficient sorting algorithm that uses divide-and-conquer to sort arrays by partitioning elements around a pivot."
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
            Bubble Sort
          </Button>
          <Button
            size="sm"
            variant={selectedAlgorithm === 'quick' ? 'default' : 'outline'}
            onClick={() => setSelectedAlgorithm('quick')}
          >
            Quick Sort
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
