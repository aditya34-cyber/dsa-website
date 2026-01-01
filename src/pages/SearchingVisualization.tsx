import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateBinarySearchSteps } from "@/algorithms/binarySearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SearchingVisualization = () => {
  const [sortedData] = useState(() => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    return arr.sort((a, b) => a - b);
  });
  const [targetValue, setTargetValue] = useState(sortedData[4]); // Default to middle element

  const generateSteps = (data: number[]) => generateBinarySearchSteps(data, targetValue);
  const steps = generateSteps(sortedData);

  const renderSearchElement = (value: number, index: number, isHighlighted: boolean, isComparing: boolean) => (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`
          flex items-center justify-center w-16 h-16 rounded-lg text-white font-bold text-sm
          transition-all duration-300 border-2
          ${isComparing ? 'bg-destructive border-destructive-foreground scale-110 shadow-lg' : 
            isHighlighted ? 'bg-primary border-primary-foreground scale-105 shadow-md' : 
            'bg-muted-foreground border-muted'}
        `}
      >
        {value}
      </div>
      <span className="text-xs text-muted-foreground font-mono">[{index}]</span>
    </div>
  );

  const handleTargetChange = (newTarget: string) => {
    const target = parseInt(newTarget);
    if (!isNaN(target)) {
      setTargetValue(target);
    }
  };

  const generateRandomTarget = () => {
    const randomTarget = Math.floor(Math.random() * 100) + 1;
    setTargetValue(randomTarget);
  };

  const selectExistingTarget = () => {
    const randomIndex = Math.floor(Math.random() * sortedData.length);
    setTargetValue(sortedData[randomIndex]);
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Configuration */}
        <div className="flex items-center gap-4 mb-4 flex-wrap bg-card/80 border border-border/20 rounded-lg p-3">
          <Label htmlFor="target" className="text-sm font-medium">Target:</Label>
          <Input
            id="target"
            type="number"
            value={targetValue}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-24 h-8 bg-background/50"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={selectExistingTarget}
          >
            Random Existing
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={generateRandomTarget}
          >
            Random Number
          </Button>
          <span className="text-xs text-muted-foreground">
            Array: [{sortedData.join(", ")}]
          </span>
        </div>

        {/* Visualizer */}
        <AlgorithmVisualizer
          title="Binary Search Visualization"
          initialData={sortedData}
          steps={steps}
          onGenerateSteps={(data) => generateBinarySearchSteps(data, targetValue)}
          renderElement={renderSearchElement}
          algorithmType="searching"
        />
      </div>
    </div>
  );
};

export default SearchingVisualization;