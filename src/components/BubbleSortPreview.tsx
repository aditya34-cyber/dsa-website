import { useState } from "react";
import { AlgorithmVisualizer } from "@/components/AlgorithmVisualizer";
import { generateBubbleSortSteps } from "@/algorithms/bubbleSort";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const BubbleSortPreview = () => {
  const navigate = useNavigate();
  const [currentData] = useState(() =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 1)
  );

  const steps = generateBubbleSortSteps(currentData);

  const renderSortElement = (
    value: number,
    index: number,
    isHighlighted: boolean,
    isComparing: boolean
  ) => (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-end justify-center p-2 min-w-[50px] text-white font-bold text-sm rounded-t transition-all duration-300"
        style={{
          height: `${(value / 100) * 150 + 40}px`,
          backgroundColor: isComparing
            ? "hsl(var(--destructive))"
            : isHighlighted
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
        }}
      >
        {value}
      </div>
      <span className="text-xs text-muted-foreground">{index}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="glass-card bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="font-space text-2xl">
            Preview: Bubble Sort Algorithm
          </CardTitle>
          <CardDescription>
            Watch how Bubble Sort works! Login to access all algorithms,
            visualizations, and practice challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Bubble Sort repeatedly steps through the list, compares adjacent
            elements and swaps them if they are in the wrong order.
          </p>
        </CardContent>
      </Card>

      <AlgorithmVisualizer
        title="Bubble Sort Visualization"
        initialData={currentData}
        steps={steps}
        onGenerateSteps={generateBubbleSortSteps}
        renderElement={renderSortElement}
        algorithmType="sorting"
      />

      <Card className="glass-card bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Lock className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-space font-semibold text-foreground">
              Want to explore more?
            </h3>
            <p className="text-muted-foreground">
              Login to access Quick Sort, Searching Algorithms, Stacks, Queues,
              and interactive coding challenges!
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-glow"
              >
                Login to Continue
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BubbleSortPreview;
