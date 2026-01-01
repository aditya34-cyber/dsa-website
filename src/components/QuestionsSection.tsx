import { useState } from "react";
import { QuestionCard, Question } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface QuestionsSectionProps {
  algorithmType: 'sorting' | 'searching';
  onBack: () => void;
}

const sortingQuestions: Question[] = [
  {
    id: 'sort-1',
    title: 'Basic Bubble Sort Understanding',
    difficulty: 'Easy',
    description: 'In bubble sort, what happens during each pass through the array? After the first complete pass, what can we guarantee about the array?',
    example: 'Array: [64, 34, 25, 12, 22, 11, 90]',
    expectedOutput: 'After first pass: [34, 25, 12, 22, 11, 64, 90]',
    hints: [
      'Think about what "bubbles up" to the end',
      'The largest element moves to its correct position',
      'Each pass guarantees one element is in its final position'
    ],
    correctAnswer: 'The largest element bubbles up to the end and is in its final sorted position',
    explanation: 'In bubble sort, each pass compares adjacent elements and swaps them if they are in the wrong order. This causes the largest element to "bubble up" to the end of the array, guaranteeing it\'s in its final sorted position.'
  },
  {
    id: 'sort-2',
    title: 'Quick Sort Partitioning',
    difficulty: 'Medium',
    description: 'What is the purpose of the partition step in Quick Sort, and what condition must be satisfied after partitioning?',
    example: 'Pivot = 25, Array: [64, 34, 25, 12, 22, 11, 90]',
    expectedOutput: 'All elements ≤ 25 on left, all elements > 25 on right',
    hints: [
      'Think about dividing the array around the pivot',
      'Elements are rearranged relative to the pivot value',
      'The pivot ends up in its final sorted position'
    ],
    correctAnswer: 'Partitioning places all elements smaller than or equal to the pivot on the left and all larger elements on the right',
    explanation: 'The partition step rearranges the array so that all elements less than or equal to the pivot are on its left, and all elements greater than the pivot are on its right. The pivot is then in its final sorted position.'
  }
];

const searchingQuestions: Question[] = [
  {
    id: 'search-1',
    title: 'Binary Search Prerequisites',
    difficulty: 'Easy',
    description: 'What condition must be met for binary search to work correctly, and why is this condition necessary?',
    example: 'Valid: [1, 3, 5, 7, 9, 11], Invalid: [5, 2, 8, 1, 9, 3]',
    hints: [
      'Think about the array arrangement',
      'How does binary search decide which half to eliminate?',
      'What assumption does the algorithm make about element ordering?'
    ],
    correctAnswer: 'The array must be sorted because binary search relies on comparing with the middle element to eliminate half the search space',
    explanation: 'Binary search requires a sorted array because it works by comparing the target with the middle element and eliminating half the search space based on this comparison. This only works if elements are in order.'
  },
  {
    id: 'search-2',
    title: 'Binary Search Efficiency',
    difficulty: 'Medium',
    description: 'Why is binary search more efficient than linear search? What is the time complexity and how is it achieved?',
    example: 'Array of 1000 elements: Linear = up to 1000 comparisons, Binary = up to 10 comparisons',
    hints: [
      'Think about how much of the array is eliminated in each step',
      'Compare the maximum number of steps needed',
      'Consider the mathematical relationship: log₂(n)'
    ],
    correctAnswer: 'Binary search is O(log n) because it eliminates half the remaining elements in each step, versus linear search which is O(n)',
    explanation: 'Binary search achieves O(log n) time complexity by eliminating half the search space in each iteration. For an array of size n, it takes at most log₂(n) steps to find an element or determine it doesn\'t exist.'
  }
];

export const QuestionsSection = ({ algorithmType, onBack }: QuestionsSectionProps) => {
  const questions = algorithmType === 'sorting' ? sortingQuestions : searchingQuestions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    setCompletedQuestions(prev => new Set(prev).add(currentQuestion.id));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowCompletion(true);
    }
  };

  const handleHarder = () => {
    // Find next harder question or create a variation
    const nextHardIndex = questions.findIndex((q, idx) => 
      idx > currentQuestionIndex && 
      (q.difficulty === 'Medium' || q.difficulty === 'Hard')
    );
    
    if (nextHardIndex !== -1) {
      setCurrentQuestionIndex(nextHardIndex);
    } else {
      handleNext(); // Fallback to next question
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCompletedQuestions(new Set());
    setShowCompletion(false);
  };

  const progressPercentage = (completedQuestions.size / questions.length) * 100;

  if (showCompletion) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <Card className="glass-card bg-card/90 border-border/30 p-8">
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-space font-bold heading-gradient mb-4">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    You've completed all {algorithmType} questions!
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-primary font-medium mb-2">Your Progress:</p>
                  <p className="text-2xl font-bold text-primary">
                    {completedQuestions.size} / {questions.length} Questions Completed
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-center">
                  <Button onClick={handleRestart} className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Visualization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Visualization
            </Button>
            <h1 className="text-3xl font-space font-bold heading-gradient">
              {algorithmType === 'sorting' ? 'Sorting' : 'Searching'} Practice Questions
            </h1>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card className="glass-card bg-card/80 border-border/20 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-space">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-background/30 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {completedQuestions.size} of {questions.length} questions completed
            </p>
          </CardContent>
        </Card>

        {/* Current Question */}
        <QuestionCard
          question={currentQuestion}
          onNext={handleNext}
          onHarder={handleHarder}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
};