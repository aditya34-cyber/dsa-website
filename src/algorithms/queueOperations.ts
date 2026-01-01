import { AlgorithmStep } from "@/components/AlgorithmVisualizer";

export interface QueueOperation {
  type: 'enqueue' | 'dequeue' | 'front' | 'rear' | 'isEmpty';
  value?: number;
}

export const generateQueueSteps = (operations: QueueOperation[]): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  let queue: number[] = [];
  let operationIndex = 0;

  // Initial state
  steps.push({
    type: 'highlight',
    indices: [],
    values: [...queue],
    description: "Starting with an empty queue. A queue follows FIFO (First-In, First-Out) principle.",
    theory: "A queue is like a line at a ticket counter - the first person in line is the first person to be served. Elements are added at the rear and removed from the front.",
    complexity: "All basic queue operations (enqueue, dequeue, front, rear) have O(1) time complexity!"
  });

  operations.forEach((operation) => {
    operationIndex++;
    
    switch (operation.type) {
      case 'enqueue':
        if (operation.value !== undefined) {
          queue.push(operation.value);
          steps.push({
            type: 'insert',
            indices: [queue.length - 1],
            values: [...queue],
            description: `Enqueue ${operation.value} into the queue. The element is added to the rear.`,
            theory: `Enqueue operation: Add element to the rear (end) of the queue. Like a person joining the back of a line.`,
            complexity: "Enqueue operation: O(1) - Adding to the rear takes constant time."
          });
        }
        break;
        
      case 'dequeue':
        if (queue.length > 0) {
          const dequeuedValue = queue.shift()!;
          steps.push({
            type: 'delete',
            indices: [0],
            values: [...queue],
            description: `Dequeue ${dequeuedValue} from the queue. The front element is removed and returned.`,
            theory: `Dequeue operation: Remove and return the front element. Like the first person in line being served and leaving.`,
            complexity: "Dequeue operation: O(1) for linked list implementation, O(n) for array implementation due to shifting."
          });
        } else {
          steps.push({
            type: 'highlight',
            indices: [],
            values: [...queue],
            description: "Cannot dequeue from empty queue! This would cause a queue underflow error.",
            theory: "Queue underflow: Attempting to dequeue from an empty queue is an error condition that must be handled.",
            complexity: "Always check if queue is empty before dequeuing to avoid runtime errors."
          });
        }
        break;
        
      case 'front':
        if (queue.length > 0) {
          steps.push({
            type: 'highlight',
            indices: [0],
            values: [...queue],
            description: `Front element: ${queue[0]}. The element is viewed but not removed.`,
            theory: "Front operation: View the front element without removing it. Like looking at who's first in line.",
            complexity: "Front operation: O(1) - Just accessing the front element takes constant time."
          });
        } else {
          steps.push({
            type: 'highlight',
            indices: [],
            values: [...queue],
            description: "Cannot view front of empty queue! No elements to view.",
            theory: "Empty queue: When the queue has no elements, front operation should handle this gracefully.",
            complexity: "Always check if queue is empty before accessing front element."
          });
        }
        break;
        
      case 'rear':
        if (queue.length > 0) {
          steps.push({
            type: 'highlight',
            indices: [queue.length - 1],
            values: [...queue],
            description: `Rear element: ${queue[queue.length - 1]}. The last element in the queue.`,
            theory: "Rear operation: View the rear (last) element. Like looking at who's last in line.",
            complexity: "Rear operation: O(1) - Just accessing the rear element takes constant time."
          });
        } else {
          steps.push({
            type: 'highlight',
            indices: [],
            values: [...queue],
            description: "Cannot view rear of empty queue! No elements to view.",
            theory: "Empty queue: When the queue has no elements, rear operation should handle this gracefully.",
            complexity: "Always check if queue is empty before accessing rear element."
          });
        }
        break;
        
      case 'isEmpty':
        steps.push({
          type: 'highlight',
          indices: [],
          values: [...queue],
          description: `Queue is ${queue.length === 0 ? 'empty' : 'not empty'}. Current size: ${queue.length}`,
          theory: "isEmpty operation: Check if the queue contains any elements. Returns true if empty, false otherwise.",
          complexity: "isEmpty operation: O(1) - Just checking the size/length takes constant time."
        });
        break;
    }
  });

  // Final state
  steps.push({
    type: 'complete',
    indices: [],
    values: [...queue],
    description: `Queue operations completed. Final queue contains ${queue.length} element(s).`,
    theory: "Queues are essential for breadth-first search, task scheduling, handling requests in web servers, and managing resources.",
    complexity: "Space complexity: O(n) where n is the number of elements in the queue."
  });

  return steps;
};

// Predefined operation sequences for demonstration
export const defaultQueueOperations: QueueOperation[] = [
  { type: 'enqueue', value: 10 },
  { type: 'enqueue', value: 20 },
  { type: 'enqueue', value: 30 },
  { type: 'front' },
  { type: 'rear' },
  { type: 'dequeue' },
  { type: 'enqueue', value: 40 },
  { type: 'front' },
  { type: 'dequeue' },
  { type: 'dequeue' },
  { type: 'isEmpty' },
  { type: 'dequeue' },
  { type: 'isEmpty' }
];