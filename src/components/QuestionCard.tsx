import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  example?: string;
  expectedOutput?: string;
  hints: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  onHarder: () => void;
  questionIndex: number;
  totalQuestions: number;
}

export const QuestionCard = ({
  question,
  onNext,
  onHarder,
  questionIndex,
  totalQuestions
}: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const handleSubmit = () => {
    const correct = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setShowHints(false);
    setCurrentHint(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card bg-card/90 border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-space text-xl">{question.title}</CardTitle>
            <div className="flex items-center gap-3">
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {questionIndex + 1} / {totalQuestions}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Description */}
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.description}
            </p>
            {question.example && (
              <div className="mt-4 p-3 rounded bg-background/50 border border-border/30">
                <p className="text-xs font-medium text-primary mb-2">Example:</p>
                <code className="text-sm text-foreground">{question.example}</code>
                {question.expectedOutput && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-primary mb-1">Expected Output:</p>
                    <code className="text-sm text-foreground">{question.expectedOutput}</code>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Your Answer:</label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="min-h-[100px] bg-background/50 border-border/30"
              disabled={submitted}
            />
          </div>

          {/* Hints Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </Button>
              {showHints && question.hints.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentHint((prev) => Math.min(prev + 1, question.hints.length - 1))}
                  disabled={currentHint >= question.hints.length - 1}
                >
                  Next Hint ({currentHint + 1}/{question.hints.length})
                </Button>
              )}
            </div>

            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-lg bg-secondary/10 border border-secondary/20"
              >
                <p className="text-sm text-muted-foreground">
                  💡 {question.hints[currentHint]}
                </p>
              </motion.div>
            )}
          </div>

          {/* Results */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </span>
              </div>
              <p className="text-sm opacity-90 mb-4">{question.explanation}</p>
              {!isCorrect && (
                <p className="text-sm opacity-80">
                  <strong>Correct answer:</strong> {question.correctAnswer}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="flex items-center gap-2"
              >
                Submit Answer
              </Button>
            ) : (
              <>
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={onNext} className="flex items-center gap-2">
                  Next Question
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {isCorrect && (
                  <Button onClick={onHarder} variant="secondary" className="flex items-center gap-2">
                    Try Harder Question
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};