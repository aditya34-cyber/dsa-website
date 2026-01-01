import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateStackSteps, defaultStackOperations, StackOperation } from "@/algorithms/stackOperations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const StackVisualization = () => {
  const [customOperations, setCustomOperations] = useState<StackOperation[]>(defaultStackOperations);
  const [inputValue, setInputValue] = useState("");

  const handleGenerateSteps = (data: any[]) => {
    return generateStackSteps(customOperations);
  };

  const addPushOperation = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setCustomOperations(prev => [...prev, { type: 'push', value }]);
      setInputValue("");
    }
  };

  const addOperation = (type: 'pop' | 'peek' | 'isEmpty') => {
    setCustomOperations(prev => [...prev, { type }]);
  };

  const clearOperations = () => {
    setCustomOperations([]);
  };

  const resetToDefault = () => {
    setCustomOperations(defaultStackOperations);
  };

  const renderStackElement = (value: any, index: number, isHighlighted: boolean, isComparing: boolean) => {
    const stackHeight = customOperations.length > 0 ? Math.min(300, customOperations.length * 20) : 200;
    const elementHeight = 60;
    const elementWidth = 120;
    
    return (
      <div
        key={`stack-${index}-${value}`}
        className="flex flex-col items-center justify-center relative transition-all duration-300"
        style={{
          width: `${elementWidth}px`,
          height: `${elementHeight}px`,
          marginBottom: '4px',
        }}
      >
        <div
          className={`
            w-full h-full rounded-lg border-2 flex items-center justify-center text-white font-bold text-lg
            transition-all duration-500 shadow-lg
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
        {index === customOperations.filter(op => op.type === 'push').length - 1 && (
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 text-sm text-primary font-semibold">
            ← TOP
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Compact Header */}
        <h1 className="text-2xl font-space font-bold heading-gradient mb-4">Stack Data Structure</h1>

        {/* Compact Operations Panel */}
        <Card className="glass-card bg-card/90 border-border/30 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Input
                type="number"
                placeholder="Value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24 h-8 bg-background/50"
                onKeyPress={(e) => e.key === 'Enter' && addPushOperation()}
              />
              <Button size="sm" onClick={addPushOperation} disabled={!inputValue}>
                Push
              </Button>
              <Button size="sm" onClick={() => addOperation('pop')} variant="outline">
                Pop
              </Button>
              <Button size="sm" onClick={() => addOperation('peek')} variant="outline">
                Peek
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

            {/* Show entered operations */}
            {customOperations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Operations Queue:</p>
                <div className="flex flex-wrap gap-2">
                  {customOperations.map((op, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-md font-mono ${
                        op.type === 'push' ? 'bg-primary/20 text-primary' :
                        op.type === 'pop' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {op.type === 'push' ? `push(${op.value})` : `${op.type}()`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Algorithm Visualizer */}
        <AlgorithmVisualizer
          title="Stack Operations Visualization"
          initialData={[]}
          steps={generateStackSteps(customOperations)}
          onGenerateSteps={handleGenerateSteps}
          renderElement={renderStackElement}
          algorithmType="stack"
        />
      </div>
    </div>
  );
};

export default StackVisualization;