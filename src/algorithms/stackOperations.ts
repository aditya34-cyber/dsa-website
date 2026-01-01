import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export interface StackOperation {
  type: 'push' | 'pop' | 'peek' | 'isEmpty';
  value?: number;
}

export const generateStackSteps = (operations: StackOperation[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  let stack: number[] = [];
  let operationIndex = 0;

  // Initial state
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...stack],
    description: "Starting with an empty stack. A stack follows LIFO (Last-In, First-Out) principle.",
    theory: "A stack is like a stack of plates - you can only add or remove plates from the top. The last plate you put on top is the first one you'll take off.",
    complexity: "All stack operations (push, pop, peek) have O(1) time complexity - constant time!"
  });

  operations.forEach((operation) => {
    operationIndex++;
    
    switch (operation.type) {
      case 'push':
        if (operation.value !== undefined) {
          stack.push(operation.value);
          steps.push({
            type: 'insert',
            indices: [stack.length - 1],
            values: [...stack],
            description: `Push ${operation.value} onto the stack. The element is added to the top.`,
            theory: `Push operation: Add element to the top of the stack. Think of placing a new plate on top of a stack of plates.`,
            complexity: "Push operation: O(1) - Adding to the top takes constant time regardless of stack size."
          });
        }
        break;
        
      case 'pop':
        if (stack.length > 0) {
          const poppedValue = stack.pop()!;
          steps.push({
            type: 'delete',
            indices: [stack.length],
            values: [...stack],
            description: `Pop ${poppedValue} from the stack. The top element is removed and returned.`,
            theory: `Pop operation: Remove and return the top element. Like taking the top plate from a stack.`,
            complexity: "Pop operation: O(1) - Removing from the top takes constant time."
          });
        } else {
          steps.push({
            type: 'highlight',
            indices: [],
            values: [...stack],
            description: "Cannot pop from empty stack! This would cause a stack underflow error.",
            theory: "Stack underflow: Attempting to pop from an empty stack is an error condition that must be handled.",
            complexity: "Always check if stack is empty before popping to avoid runtime errors."
          });
        }
        break;
        
      case 'peek':
        if (stack.length > 0) {
          steps.push({
            type: 'highlight',
            indices: [stack.length - 1],
            values: [...stack],
            description: `Peek at top element: ${stack[stack.length - 1]}. The element is viewed but not removed.`,
            theory: "Peek operation: View the top element without removing it. Like looking at the top plate without taking it.",
            complexity: "Peek operation: O(1) - Just accessing the top element takes constant time."
          });
        } else {
          steps.push({
            type: 'highlight',
            indices: [],
            values: [...stack],
            description: "Cannot peek at empty stack! No elements to view.",
            theory: "Empty stack: When the stack has no elements, peek operation should handle this gracefully.",
            complexity: "Always check if stack is empty before peeking."
          });
        }
        break;
        
      case 'isEmpty':
        steps.push({
          type: 'highlight',
          indices: [],
          values: [...stack],
          description: `Stack is ${stack.length === 0 ? 'empty' : 'not empty'}. Current size: ${stack.length}`,
          theory: "isEmpty operation: Check if the stack contains any elements. Returns true if empty, false otherwise.",
          complexity: "isEmpty operation: O(1) - Just checking the size/length takes constant time."
        });
        break;
    }
  });

  // Final state
  steps.push({
    type: 'complete',
    indices: [],
    values: [...stack],
    description: `Stack operations completed. Final stack contains ${stack.length} element(s).`,
    theory: "Stack operations are fundamental for many algorithms like function calls, expression evaluation, and backtracking.",
    complexity: "Space complexity: O(n) where n is the number of elements in the stack."
  });

  return steps;
};

// Predefined operation sequences for demonstration
export const defaultStackOperations: StackOperation[] = [
  { type: 'push', value: 10 },
  { type: 'push', value: 20 },
  { type: 'push', value: 30 },
  { type: 'peek' },
  { type: 'pop' },
  { type: 'push', value: 40 },
  { type: 'isEmpty' },
  { type: 'pop' },
  { type: 'pop' },
  { type: 'pop' },
  { type: 'isEmpty' }
];