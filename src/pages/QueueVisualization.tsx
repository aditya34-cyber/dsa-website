import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateQueueSteps, defaultQueueOperations, QueueOperation } from "@/algorithms/queueOperations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const QueueVisualization = () => {
  const [customOperations, setCustomOperations] = useState<QueueOperation[]>(defaultQueueOperations);
  const [inputValue, setInputValue] = useState("");

  const handleGenerateSteps = (data: any[]) => {
    return generateQueueSteps(customOperations);
  };

  const addEnqueueOperation = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setCustomOperations(prev => [...prev, { type: 'enqueue', value }]);
      setInputValue("");
    }
  };

  const addOperation = (type: 'dequeue' | 'front' | 'rear' | 'isEmpty') => {
    setCustomOperations(prev => [...prev, { type }]);
  };

  const clearOperations = () => {
    setCustomOperations([]);
  };

  const resetToDefault = () => {
    setCustomOperations(defaultQueueOperations);
  };

  const renderQueueElement = (value: any, index: number, isHighlighted: boolean, isComparing: boolean) => {
    const elementHeight = 80;
    const elementWidth = 80;
    
    return (
      <div
        key={`queue-${index}-${value}`}
        className="flex flex-col items-center justify-center relative transition-all duration-300"
        style={{
          width: `${elementWidth}px`,
          height: `${elementHeight}px`,
          marginRight: '8px',
        }}
      >
        <div
          className={`
            w-full h-full rounded-lg border-2 flex items-center justify-center text-white font-bold text-lg
            transition-all duration-500 shadow-lg relative
            ${isHighlighted ? 'bg-primary border-primary-glow shadow-primary/50' : 
              isComparing ? 'bg-destructive border-destructive' : 
              'bg-muted border-border'}
          `}
          style={{
            transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isHighlighted ? 'var(--shadow-glow)' : '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {value}
        </div>
        
        {/* Front and Rear labels */}
        {index === 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-primary font-semibold bg-primary/20 px-2 py-1 rounded">
            FRONT
          </div>
        )}
        {index === Math.max(0, customOperations.filter(op => op.type === 'enqueue').length - customOperations.filter(op => op.type === 'dequeue').length - 1) && customOperations.some(op => op.type === 'enqueue') && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-secondary font-semibold bg-secondary/20 px-2 py-1 rounded">
            REAR
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Compact Header */}
        <h1 className="text-2xl font-space font-bold heading-gradient mb-4">Queue Data Structure</h1>

        {/* Compact Operations Panel */}
        <Card className="glass-card bg-card/90 border-border/30 mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Input
                type="number"
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24 h-8 bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && addEnqueueOperation()}
              />
              <Button size="sm" onClick={addEnqueueOperation} disabled={!inputValue}>
                Enqueue
              </Button>
              <Button size="sm" onClick={() => addOperation('dequeue')} variant="outline">
                Dequeue
              </Button>
              <Button size="sm" onClick={() => addOperation('front')} variant="outline">
                Front
              </Button>
              <Button size="sm" onClick={() => addOperation('rear')} variant="outline">
                Rear
              </Button>
              <Button size="sm" onClick={() => addOperation('isEmpty')} variant="outline">
                Is Empty?
              </Button>
              <div className="flex gap-2 ml-auto">
                <Button onClick={clearOperations} variant="secondary" size="sm">
                  Clear
                </Button>
                <Button onClick={resetToDefault} variant="secondary" size="sm">
                  Reset
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-primary"></div>
                REAR →
              </span>
              <span className="font-mono">[FRONT] ... [REAR]</span>
              <span className="flex items-center gap-1">
                → FRONT
                <div className="w-2 h-2 rounded bg-secondary"></div>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Visualizer */}
        <AlgorithmVisualizer
          title="Queue Operations Visualization"
          initialData={[]}
          steps={generateQueueSteps(customOperations)}
          onGenerateSteps={handleGenerateSteps}
          renderElement={renderQueueElement}
          algorithmType="queue"
        />
      </div>
    </div>
  );
};

export default QueueVisualization;