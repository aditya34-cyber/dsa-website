import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
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

  useEffect(() => {
    setSteps(initialSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [initialSteps]);

  const executeStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex >= steps.length) return;

      const step = steps[stepIndex];

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
    [steps, currentData]
  );

  useEffect(() => {
    if (currentStep < steps.length) executeStep(currentStep);
  }, [currentStep, executeStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) =>
          prev >= steps.length - 1 ? prev : prev + 1
        );
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  const handleRestart = () => {
    setCurrentStep(0);
    setCurrentData(initialData);
    setIsPlaying(false);
    setHighlightedIndices([]);
    setComparingIndices([]);
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl sm:text-3xl font-space font-bold heading-gradient">
            {title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <Card className="glass-card bg-card/80 border-border/20">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-lg font-space">
                    Algorithm Controls
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
                <Progress value={progress} className="w-full h-2" />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause /> : <Play />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((p) => p + 1)}
                    disabled={currentStep >= steps.length - 1}
                  >
                    <SkipForward />
                    Step
                  </Button>

                  <Button variant="outline" onClick={handleRestart}>
                    <RotateCcw />
                    Restart
                  </Button>

                  <Button
                    variant="secondary"
                    className="sm:ml-auto"
                    onClick={() => {
                      const newData =
                        algorithmType === "sorting"
                          ? Array.from({ length: 8 }, () =>
                              Math.floor(Math.random() * 100) + 1
                            )
                          : initialData;
                      setSteps(onGenerateSteps(newData));
                      setCurrentData(newData);
                      setCurrentStep(0);
                    }}
                  >
                    Generate New Data
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm">Speed:</span>
                  {[2000, 1000, 500, 250].map((speed) => (
                    <Button
                      key={speed}
                      size="sm"
                      variant={playbackSpeed === speed ? "default" : "outline"}
                      onClick={() => setPlaybackSpeed(speed)}
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
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card className="glass-card bg-card/80 border-border/20">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div
                  className={`flex ${
                    algorithmType === "stack" || algorithmType === "queue"
                      ? "flex-col-reverse items-center"
                      : "items-end justify-center"
                  } gap-2 min-h-[250px] sm:min-h-[300px]`}
                >
                  <AnimatePresence>
                    {(algorithmType === "stack" || algorithmType === "queue"
                      ? currentStepData?.values || []
                      : currentData
                    ).map((value, index) => (
                      <motion.div key={index}>
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

          {/* Guide */}
          <div className="space-y-6">
            <Card className="glass-card bg-card/90 border-border/30">
              <CardHeader>
                <CardTitle className="text-xl font-space">
                  Algorithm Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStepData && (
                  <>
                    <p>{currentStepData.description}</p>
                    <p>{currentStepData.theory}</p>
                    {currentStepData.complexity && (
                      <p>{currentStepData.complexity}</p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
