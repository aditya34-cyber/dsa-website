import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export interface AlgorithmStep {
  type: "compare" | "swap" | "insert" | "delete" | "highlight" | "complete";
  indices?: number[];
  values?: any[];
  description: string;
  theory: string;
  complexity?: string;
}

interface AlgorithmVisualizerProps {
  title: string;
  initialData: any[];
  steps: AlgorithmStep[];
  onGenerateSteps: (data: any[]) => AlgorithmStep[];
  renderElement: (
    value: any,
    index: number,
    isHighlighted: boolean,
    isComparing: boolean
  ) => React.ReactNode;
  algorithmType: "sorting" | "searching" | "stack" | "queue";
}

export const AlgorithmVisualizer = ({
  title,
  initialData,
  steps: initialSteps,
  onGenerateSteps,
  renderElement,
  algorithmType,
}: AlgorithmVisualizerProps) => {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState(initialData);
  const [steps, setSteps] = useState<AlgorithmStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);

  const executeStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= steps.length) return;

      const step = steps[stepIndex];

      // For stack/queue, always update currentData from step.values
      if (algorithmType === "stack" || algorithmType === "queue") {
        setCurrentData(step.values || []);
      }

      switch (step.type) {
        case "compare":
          setComparingIndices(step.indices || []);
          setHighlightedIndices([]);
          break;
        case "swap":
          if (step.indices && step.indices.length === 2) {
            const [i, j] = step.indices;
            const newData = [...currentData];
            [newData[i], newData[j]] = [newData[j], newData[i]];
            setCurrentData(newData);
          }
          setComparingIndices([]);
          setHighlightedIndices(step.indices || []);
          break;
        case "highlight":
          setHighlightedIndices(step.indices || []);
          setComparingIndices([]);
          break;
        case "insert":
          setHighlightedIndices(step.indices || []);
          setComparingIndices([]);
          break;
        case "complete":
          setHighlightedIndices([]);
          setComparingIndices([]);
          break;
      }
    },
    [steps, currentData, algorithmType]
  );

  useEffect(() => {
    if (currentStep < steps.length) {
      executeStep(currentStep);
    }
  }, [currentStep, executeStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      handleRestart();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCurrentData(initialData);
    setIsPlaying(false);
    setHighlightedIndices([]);
    setComparingIndices([]);
  };

  const handleGenerateNewData = () => {
    const newData =
      algorithmType === "sorting"
        ? Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
        : initialData;

    const newSteps = onGenerateSteps(newData);
    setSteps(newSteps);
    setCurrentData(newData);
    setCurrentStep(0);
    setIsPlaying(false);
    setHighlightedIndices([]);
    setComparingIndices([]);
  };
  <AlgorithmVisualizer
    title="Stack Visualization"
    initialData={[]}
    steps={onGenerateSteps(initialData)}
    onGenerateSteps={onGenerateSteps}
    renderElement={(value, idx, isHighlighted) => (
      <div
        style={{
          border:
            idx === currentData.length - 1
              ? "2px solid #6366F1"
              : "1px solid #CBD5E1",
          background: isHighlighted ? "#A5B4FC" : "#F3F4F6",
          borderRadius: "8px",
          padding: "16px",
          minWidth: "48px",
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "4px",
        }}
        className="stack-item"
      >
        {value}
      </div>
    )}
    algorithmType="stack"
  />;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-space font-bold heading-gradient">
            {title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <Card className="glass-card bg-card/80 border-border/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-space">
                    Algorithm Controls
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePlay}
                    disabled={currentStep >= steps.length}
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleStepForward}
                    disabled={currentStep >= steps.length - 1}
                    className="flex items-center gap-2"
                  >
                    <SkipForward className="h-4 w-4" />
                    Step
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleRestart}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleGenerateNewData}
                    className="flex items-center gap-2 ml-auto"
                  >
                    Generate New Data/Apply Changes
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Speed:</label>
                  <div className="flex gap-2">
                    {[2000, 1000, 500, 250].map((speed) => (
                      <Button
                        key={speed}
                        variant={
                          playbackSpeed === speed ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPlaybackSpeed(speed)}
                        className="h-8 px-3 text-xs"
                      >
                        {speed === 2000
                          ? "0.5x"
                          : speed === 1000
                          ? "1x"
                          : speed === 500
                          ? "2x"
                          : "4x"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="glass-card bg-card/80 border-border/20">
              <CardContent className="p-8">
                <div className="flex items-end justify-center gap-2 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {currentData.map((value, index) => (
                      <motion.div
                        key={`${value}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          backgroundColor: comparingIndices.includes(index)
                            ? "hsl(var(--destructive))"
                            : highlightedIndices.includes(index)
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted))",
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                          backgroundColor: { duration: 0.3 },
                        }}
                        className="relative"
                      >
                        {renderElement(
                          value,
                          index,
                          highlightedIndices.includes(index),
                          comparingIndices.includes(index)
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Theory Panel */}
          <div className="space-y-6">
            <Card className="glass-card bg-card/90 border-border/30">
              <CardHeader className="pb-4">
                <CardTitle className="font-space text-xl">
                  Algorithm Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStepData && (
                  <>
                    {/* Current Step */}
                    <div className="p-6 rounded-lg bg-accent/20 border border-accent/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
                        <p className="font-semibold text-accent-foreground text-lg">
                          Current Step
                        </p>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentStepData.description}
                      </p>
                    </div>

                    {/* Theory Explanation */}
                    <div className="p-6 rounded-lg bg-primary/20 border border-primary/30">
                      <p className="font-semibold text-primary mb-4 text-lg flex items-center gap-2">
                        💡 How it Works
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {currentStepData.theory}
                      </p>
                    </div>

                    {/* Complexity Information */}
                    {currentStepData.complexity && (
                      <div className="p-6 rounded-lg bg-secondary/20 border border-secondary/30">
                        <p className="font-semibold text-secondary-foreground mb-4 text-lg flex items-center gap-2">
                          ⚡ Performance
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {currentStepData.complexity}
                        </p>
                      </div>
                    )}

                    {/* Algorithm Analogy */}
                    <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                      <p className="font-semibold text-foreground mb-4 text-lg flex items-center gap-2">
                        🎯 Real-World Analogy
                      </p>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {algorithmType === "sorting"
                          ? "Think of sorting like organizing books on a shelf - you compare heights and rearrange them until they're in order from shortest to tallest."
                          : algorithmType === "searching"
                          ? "Binary search is like finding a word in a dictionary - you open to the middle, see if your word comes before or after, then repeat with the correct half until you find it."
                          : algorithmType === "stack"
                          ? "A stack is like a stack of plates - you add and remove plates only from the top. The last plate you put on top is the first one you’ll take off."
                          : algorithmType === "queue"
                          ? "A queue is like standing in a line at the grocery store - the first person to get in line is the first to be served and leave."
                          : ""}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card className="glass-card bg-card/80 border-border/20">
              <CardHeader>
                <CardTitle className="font-space text-lg">
                  Algorithm Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive"></div>
                    <span>Comparing elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary"></div>
                    <span>Active/Modified elements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted"></div>
                    <span>Default elements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
