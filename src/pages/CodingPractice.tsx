import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, BookOpen, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CodeEditor from "@/components/CodeEditor";

const CodingPractice = () => {
  const navigate = useNavigate();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(
    null
  );

  const challenges = [
    // Data Structures - Beginner
    {
      id: "stack-implementation",
      title: "Implement a Stack",
      difficulty: "Beginner",
      description:
        "Create a stack data structure with push, pop, peek, and isEmpty methods.",
      starter: `#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

class Stack {
private:
    vector<int> data;
    
public:
    // Add element to top of stack
    void push(int element) {
        // Your code here
    }
    
    // Remove and return top element
    int pop() {
        // Your code here
        // Remember to handle empty stack case
    }
    
    // Return top element without removing
    int peek() {
        // Your code here
    }
    
    // Check if stack is empty
    bool isEmpty() {
        // Your code here
    }
    
    // Return stack size
    int size() {
        // Your code here
    }
};

int main() {
    Stack stack;
    stack.push(1);
    stack.push(2);
    cout << "Top element: " << stack.peek() << endl;  // Should output: 2
    cout << "Popped: " << stack.pop() << endl;       // Should output: 2
    cout << "Size: " << stack.size() << endl;        // Should output: 1
    return 0;
}`,
      category: "data-structures",
      language: "cpp",
    },
    {
      id: "stack-python",
      title: "Stack Implementation (Python)",
      difficulty: "Beginner",
      description:
        "Create a stack data structure in Python with push, pop, peek, and is_empty methods.",
      starter: `# Implement a Stack class in Python
class Stack:
    def __init__(self):
        # Your code here
        pass
    
    def push(self, element):
        # Add element to top of stack
        pass
    
    def pop(self):
        # Remove and return top element
        pass
    
    def peek(self):
        # Return top element without removing
        pass
    
    def is_empty(self):
        # Check if stack is empty
        pass
    
    def size(self):
        # Return stack size
        pass

# Test your implementation
stack = Stack()
stack.push(1)
stack.push(2)
print(stack.peek())  # Should output: 2
print(stack.pop())   # Should output: 2
print(stack.size())  # Should output: 1`,
      category: "data-structures",
      language: "python",
    },
    {
      id: "queue-implementation",
      title: "Implement a Queue",
      difficulty: "Beginner",
      description:
        "Create a queue data structure with enqueue, dequeue, front, and isEmpty methods.",
      starter: `#include <iostream>
#include <queue>
#include <stdexcept>
using namespace std;

class Queue {
private:
    int* data;
    int frontIndex;
    int rearIndex;
    int capacity;
    int count;
    
public:
    Queue(int size = 100) {
        // Initialize your queue
        // Your code here
    }
    
    // Add element to rear of queue
    void enqueue(int element) {
        // Your code here
    }
    
    // Remove and return front element
    int dequeue() {
        // Your code here
        // Handle empty queue case
    }
    
    // Return front element without removing
    int front() {
        // Your code here
    }
    
    // Check if queue is empty
    bool isEmpty() {
        // Your code here
    }
    
    // Return queue size
    int size() {
        // Your code here
    }
    
    ~Queue() {
        delete[] data;
    }
};

int main() {
    Queue queue;
    queue.enqueue(1);
    queue.enqueue(2);
    cout << "Front: " << queue.front() << endl;     // Should output: 1
    cout << "Dequeued: " << queue.dequeue() << endl; // Should output: 1
    cout << "Size: " << queue.size() << endl;       // Should output: 1
    return 0;
}`,
      category: "data-structures",
      language: "cpp",
    },
    {
      id: "linked-list",
      title: "Linked List Implementation",
      difficulty: "Intermediate",
      description:
        "Create a singly linked list with insert, delete, find, and display methods.",
      starter: `#include <iostream>
using namespace std;

struct ListNode {
    int data;
    ListNode* next;
    
    ListNode(int val) : data(val), next(nullptr) {}
};

class LinkedList {
private:
    ListNode* head;
    int size;
    
public:
    LinkedList() : head(nullptr), size(0) {}
    
    // Insert at the beginning of list
    void insert(int data) {
        // Your code here
    }
    
    // Delete first occurrence of data
    bool deleteNode(int data) {
        // Your code here
        // Return true if deleted, false if not found
    }
    
    // Find and return true if data exists
    bool find(int data) {
        // Your code here
    }
    
    // Display list elements
    void display() {
        // Your code here
        // Print all elements separated by spaces
    }
    
    int getSize() {
        return size;
    }
    
    // Destructor to free memory
    ~LinkedList() {
        while (head) {
            ListNode* temp = head;
            head = head->next;
            delete temp;
        }
    }
};

int main() {
    LinkedList list;
    list.insert(1);
    list.insert(2);
    list.insert(3);
    
    cout << "List: ";
    list.display();  // Should output: 3 2 1
    cout << "Size: " << list.getSize() << endl;
    
    return 0;
}`,
      category: "data-structures",
      language: "cpp",
    },

    // Searching Algorithms
    {
      id: "binary-search",
      title: "Binary Search Implementation",
      difficulty: "Intermediate",
      description:
        "Implement binary search algorithm to find an element in a sorted array.",
      starter: `#include <iostream>
#include <vector>
using namespace std;

// Implement binary search
int binarySearch(vector<int>& arr, int target) {
    // Your code here
    // Return the index of target if found, -1 otherwise
}

int main() {
    vector<int> sortedArray = {1, 3, 5, 7, 9, 11, 13, 15};
    
    cout << "Searching for 7: " << binarySearch(sortedArray, 7) << endl;   // Should output: 3
    cout << "Searching for 4: " << binarySearch(sortedArray, 4) << endl;   // Should output: -1
    cout << "Searching for 15: " << binarySearch(sortedArray, 15) << endl; // Should output: 7
    
    return 0;
}`,
      category: "searching",
      language: "cpp",
    },
    {
      id: "linear-search",
      title: "Linear Search Implementation",
      difficulty: "Beginner",
      description:
        "Implement linear search to find an element in an unsorted array.",
      starter: `def linear_search(arr, target):
    """
    Implement linear search to find target in array
    Return the index if found, -1 otherwise
    """
    # Your code here
    pass

# Test your implementation
array = [4, 2, 7, 1, 9, 3]
print(f"Searching for 7: {linear_search(array, 7)}")  # Should output: 2
print(f"Searching for 5: {linear_search(array, 5)}")  # Should output: -1
print(f"Searching for 1: {linear_search(array, 1)}")  # Should output: 3`,
      category: "searching",
      language: "python",
    },

    // Sorting Algorithms
    {
      id: "bubble-sort",
      title: "Bubble Sort Implementation",
      difficulty: "Beginner",
      description:
        "Implement the bubble sort algorithm to sort an array in ascending order.",
      starter: `#include <iostream>
#include <vector>
using namespace std;

// Implement bubble sort
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    // Your code here
    // Sort the array in-place
}

void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    vector<int> unsortedArray = {64, 34, 25, 12, 22, 11, 90};
    
    cout << "Original: ";
    printArray(unsortedArray);
    
    bubbleSort(unsortedArray);
    
    cout << "Sorted: ";
    printArray(unsortedArray);
    
    return 0;
}`,
      category: "sorting",
      language: "cpp",
    },
    {
      id: "selection-sort",
      title: "Selection Sort Implementation",
      difficulty: "Beginner",
      description:
        "Implement selection sort algorithm to sort an array by selecting minimum elements.",
      starter: `def selection_sort(arr):
    """
    Implement selection sort
    Find minimum element and swap with first element
    Repeat for remaining array
    """
    n = len(arr)
    # Your code here
    return arr

# Test your implementation
unsorted_array = [64, 25, 12, 22, 11]
print("Original:", unsorted_array)
sorted_array = selection_sort(unsorted_array.copy())
print("Sorted:", sorted_array)`,
      category: "sorting",
      language: "python",
    },
    {
      id: "insertion-sort",
      title: "Insertion Sort Implementation",
      difficulty: "Beginner",
      description:
        "Implement insertion sort algorithm that builds sorted array one element at a time.",
      starter: `#include <iostream>
#include <vector>
using namespace std;

// Implement insertion sort
void insertionSort(vector<int>& arr) {
    // Your code here
    // Insert each element in its correct position
}

void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    vector<int> unsortedArray = {5, 2, 4, 6, 1, 3};
    
    cout << "Original: ";
    printArray(unsortedArray);
    
    insertionSort(unsortedArray);
    
    cout << "Sorted: ";
    printArray(unsortedArray);
    
    return 0;
}`,
      category: "sorting",
      language: "cpp",
    },
    {
      id: "merge-sort",
      title: "Merge Sort Implementation",
      difficulty: "Advanced",
      description: "Implement the divide-and-conquer merge sort algorithm.",
      starter: `def merge_sort(arr):
    """Implement merge sort using divide and conquer"""
    # Base case
    if len(arr) <= 1:
        return arr
    
    # Divide
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Conquer and combine
    return merge(merge_sort(left), merge_sort(right))

def merge(left, right):
    """Merge two sorted arrays"""
    # Your code here
    pass

# Test your implementation
unsorted_array = [38, 27, 43, 3, 9, 82, 10]
print("Original:", unsorted_array)
sorted_array = merge_sort(unsorted_array)
print("Sorted:", sorted_array)`,
      category: "sorting",
      language: "python",
    },
    {
      id: "quick-sort",
      title: "Quick Sort Implementation",
      difficulty: "Advanced",
      description: "Implement the quick sort algorithm using partitioning.",
      starter: `#include <iostream>
#include <vector>
using namespace std;

// Implement quick sort
void quickSort(vector<int>& arr, int low, int high) {
    // Your code here
    // Use partitioning and recursion
}

int partition(vector<int>& arr, int low, int high) {
    // Your code here
    // Choose pivot and partition array
    return 0; // Return pivot position
}

void printArray(const vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        cout << arr[i];
        if (i < arr.size() - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    vector<int> unsortedArray = {10, 7, 8, 9, 1, 5};
    
    cout << "Original: ";
    printArray(unsortedArray);
    
    quickSort(unsortedArray, 0, unsortedArray.size() - 1);
    
    cout << "Sorted: ";
    printArray(unsortedArray);
    
    return 0;
}`,
      category: "sorting",
      language: "cpp",
    },

    // Tree Algorithms
    {
      id: "binary-tree",
      title: "Binary Tree Implementation",
      difficulty: "Intermediate",
      description: "Create a binary tree with insertion and traversal methods.",
      starter: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int data;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BinaryTree {
private:
    TreeNode* root;
    
public:
    BinaryTree() : root(nullptr) {}
    
    // Insert data into tree (level-order insertion)
    void insert(int data) {
        // Your code here
    }
    
    // Inorder traversal: Left -> Root -> Right
    void inorderTraversal(TreeNode* node, vector<int>& result) {
        // Your code here
    }
    
    // Preorder traversal: Root -> Left -> Right  
    void preorderTraversal(TreeNode* node, vector<int>& result) {
        // Your code here
    }
    
    // Postorder traversal: Left -> Right -> Root
    void postorderTraversal(TreeNode* node, vector<int>& result) {
        // Your code here
    }
    
    vector<int> inorder() {
        vector<int> result;
        inorderTraversal(root, result);
        return result;
    }
    
    TreeNode* getRoot() { return root; }
};

int main() {
    BinaryTree tree;
    tree.insert(5);
    tree.insert(3);
    tree.insert(7);
    
    vector<int> inorderResult = tree.inorder();
    cout << "Inorder: ";
    for (int val : inorderResult) {
        cout << val << " ";
    }
    cout << endl;
    
    return 0;
}`,
      category: "trees",
      language: "cpp",
    },
    {
      id: "bst-implementation",
      title: "Binary Search Tree",
      difficulty: "Advanced",
      description:
        "Implement a binary search tree with insert, search, and delete operations.",
      starter: `class TreeNode:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, data):
        """Insert maintaining BST property"""
        # Your code here
        pass
    
    def _insert_recursive(self, node, data):
        """Helper function for insertion"""
        # Your code here
        pass
    
    def search(self, data):
        """Search for data in BST"""
        # Your code here
        pass
    
    def delete(self, data):
        """Delete node while maintaining BST property"""
        # Your code here
        pass
    
    def find_min(self, node):
        """Find minimum value in BST"""
        # Your code here
        pass
    
    def inorder_traversal(self, node=None, result=None):
        """Return sorted array of values"""
        if result is None:
            result = []
        if node is None:
            node = self.root
        # Your code here
        return result

# Test your implementation
bst = BST()
bst.insert(50)
bst.insert(30)
bst.insert(70)
print("Found 30:", bst.search(30))
print("Inorder:", bst.inorder_traversal())`,
      category: "trees",
      language: "python",
    },

    // Graph Algorithms
    {
      id: "graph-representation",
      title: "Graph Representation",
      difficulty: "Intermediate",
      description:
        "Implement graph using adjacency list representation with basic operations.",
      starter: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
using namespace std;

class Graph {
private:
    unordered_map<string, vector<string>> adjacencyList;
    
public:
    // Add a vertex to the graph
    void addVertex(const string& vertex) {
        // Your code here
    }
    
    // Add an edge between two vertices  
    void addEdge(const string& vertex1, const string& vertex2) {
        // Your code here
        // Add bidirectional edge
    }
    
    // Remove edge between vertices
    void removeEdge(const string& vertex1, const string& vertex2) {
        // Your code here
    }
    
    // Remove vertex and all its edges
    void removeVertex(const string& vertex) {
        // Your code here
    }
    
    // Display the graph
    void display() {
        // Your code here
        for (const auto& pair : adjacencyList) {
            cout << pair.first << ": ";
            for (const string& neighbor : pair.second) {
                cout << neighbor << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    Graph graph;
    graph.addVertex("A");
    graph.addVertex("B");
    graph.addEdge("A", "B");
    graph.display();
    
    return 0;
}`,
      category: "graphs",
      language: "cpp",
    },
    {
      id: "dfs-traversal",
      title: "Depth-First Search",
      difficulty: "Advanced",
      description:
        "Implement DFS traversal for a graph using recursion and iterative approaches.",
      starter: `from collections import defaultdict

class Graph:
    def __init__(self):
        self.adjacency_list = defaultdict(list)
    
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
    
    def add_edge(self, vertex1, vertex2):
        self.add_vertex(vertex1)
        self.add_vertex(vertex2)
        self.adjacency_list[vertex1].append(vertex2)
        self.adjacency_list[vertex2].append(vertex1)
    
    def dfs_recursive(self, start_vertex, visited=None):
        """Implement recursive DFS"""
        if visited is None:
            visited = set()
        # Your code here
        pass
    
    def dfs_iterative(self, start_vertex):
        """Implement iterative DFS using stack"""
        # Your code here
        pass

# Test your implementation
graph = Graph()
graph.add_edge("A", "B")
graph.add_edge("A", "C")
graph.add_edge("B", "D")

print("DFS Recursive:", graph.dfs_recursive("A"))
print("DFS Iterative:", graph.dfs_iterative("A"))`,
      category: "graphs",
      language: "python",
    },

    // Dynamic Programming
    {
      id: "fibonacci-dp",
      title: "Fibonacci with Dynamic Programming",
      difficulty: "Intermediate",
      description:
        "Implement Fibonacci sequence using memoization and tabulation approaches.",
      starter: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// Approach 1: Memoization (Top-down)
int fibMemo(int n, unordered_map<int, int>& memo) {
    // Your code here
}

// Wrapper function for memoization
int fibonacciMemo(int n) {
    unordered_map<int, int> memo;
    return fibMemo(n, memo);
}

// Approach 2: Tabulation (Bottom-up)
int fibTab(int n) {
    // Your code here
}

// Approach 3: Space optimized
int fibOptimized(int n) {
    // Your code here - use only O(1) space
}

int main() {
    int n = 10;
    cout << "Fibonacci(" << n << ") Memo: " << fibonacciMemo(n) << endl;
    cout << "Fibonacci(" << n << ") Tab: " << fibTab(n) << endl;
    cout << "Fibonacci(" << n << ") Optimized: " << fibOptimized(n) << endl;
    
    return 0;
}`,
      category: "dynamic-programming",
      language: "cpp",
    },

    // String Algorithms
    {
      id: "string-palindrome",
      title: "Palindrome Checker",
      difficulty: "Beginner",
      description:
        "Check if a string is a palindrome using different approaches.",
      starter: `def is_palindrome_simple(s):
    """Simple reverse and compare approach"""
    # Your code here
    pass

def is_palindrome_two_pointer(s):
    """Two pointer approach"""
    # Your code here  
    pass

def is_palindrome_recursive(s, left=0, right=None):
    """Recursive approach"""
    if right is None:
        right = len(s) - 1
    # Your code here
    pass

# Test your implementations
test_strings = ["racecar", "hello", "madam", "level"]
for test_str in test_strings:
    print(f"{test_str}: {is_palindrome_simple(test_str)}")`,
      category: "strings",
      language: "python",
    },
  ];

  const tutorials = [
    {
      title: "Data Structures Fundamentals",
      description: "Master the building blocks of computer science",
      topics: [
        "Arrays & Lists",
        "Stacks & Queues",
        "Trees & Graphs",
        "Hash Tables",
      ],
      icon: BookOpen,
    },
    {
      title: "Algorithm Design Patterns",
      description: "Learn common algorithmic approaches and when to use them",
      topics: [
        "Divide & Conquer",
        "Dynamic Programming",
        "Greedy Algorithms",
        "Backtracking",
      ],
      icon: Target,
    },
    {
      title: "Complexity Analysis",
      description: "Master Big O notation and performance optimization",
      topics: [
        "Time Complexity",
        "Space Complexity",
        "Best/Average/Worst Cases",
        "Optimization Techniques",
      ],
      icon: Lightbulb,
    },
    {
      title: "Advanced Topics",
      description: "Explore advanced algorithms and data structures",
      topics: [
        "Graph Algorithms",
        "Tree Traversals",
        "Sorting & Searching",
        "String Algorithms",
      ],
      icon: Code,
    },
  ];

  const categories = [
    { name: "All", count: challenges.length },
    {
      name: "data-structures",
      count: challenges.filter((c) => c.category === "data-structures").length,
    },
    {
      name: "sorting",
      count: challenges.filter((c) => c.category === "sorting").length,
    },
    {
      name: "searching",
      count: challenges.filter((c) => c.category === "searching").length,
    },
    {
      name: "trees",
      count: challenges.filter((c) => c.category === "trees").length,
    },
    {
      name: "graphs",
      count: challenges.filter((c) => c.category === "graphs").length,
    },
    {
      name: "dynamic-programming",
      count: challenges.filter((c) => c.category === "dynamic-programming")
        .length,
    },
    {
      name: "strings",
      count: challenges.filter((c) => c.category === "strings").length,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const filteredChallenges = challenges.filter((challenge) => {
    const categoryMatch =
      selectedCategory === "All" || challenge.category === selectedCategory;
    const languageMatch =
      selectedLanguage === "All" || challenge.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

  const loadChallenge = (challenge: (typeof challenges)[0]) => {
    setSelectedChallenge(challenge.id);
  };

  const getSelectedChallengeCode = () => {
    const challenge = challenges.find((c) => c.id === selectedChallenge);
    return challenge?.starter || "";
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-accent/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-space font-bold heading-gradient">
                Coding Practice Area
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Practice implementing data structures and algorithms with our
              interactive code editor. Save your projects and track your
              progress.
            </p>
          </div>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="w-full flex flex-col items-stretch gap-2 sm:grid sm:grid-cols-3 sm:gap-0">
            <TabsTrigger value="editor" className="w-full text-sm sm:text-base">
              Code Editor
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="w-full text-sm sm:text-base"
            >
              Practice Challenges
            </TabsTrigger>
            <TabsTrigger
              value="tutorials"
              className="w-full text-sm sm:text-base"
            >
              Learning Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <CodeEditor
              initialCode={getSelectedChallengeCode()}
              onCodeChange={(code) => {
                // Handle code changes if needed
              }}
            />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            {/* Filters */}
            <div className="glass-card p-4 rounded-xl">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Categories:
                  </span>
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={
                        selectedCategory === category.name
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="h-8"
                    >
                      {category.name === "All"
                        ? "All"
                        : category.name.replace("-", " ")}{" "}
                      ({category.count})
                    </Button>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    Language:
                  </span>
                  <Button
                    variant={selectedLanguage === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("All")}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedLanguage === "cpp" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("cpp")}
                  >
                    C++
                  </Button>
                  <Button
                    variant={selectedLanguage === "c" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage("c")}
                  >
                    C
                  </Button>
                  <Button
                    variant={
                      selectedLanguage === "python" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedLanguage("python")}
                  >
                    Python
                  </Button>
                  <Button
                    variant={
                      selectedLanguage === "javascript" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedLanguage("javascript")}
                  >
                    JavaScript
                  </Button>
                </div>
              </div>
            </div>

            {/* Challenge Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="glass-card border-border/20 hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {challenge.title}
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm">
                          {challenge.description}
                        </CardDescription>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                          challenge.difficulty === "Beginner"
                            ? "bg-success/20 text-success"
                            : challenge.difficulty === "Intermediate"
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground capitalize">
                          {challenge.category.replace("-", " ")}
                        </span>
                        <span className="text-muted-foreground capitalize">
                          {challenge.language}
                        </span>
                      </div>
                      <Button
                        onClick={() => {
                          loadChallenge(challenge);
                          // Switch to editor tab programmatically
                          const editorTab = document.querySelector(
                            '[value="editor"]'
                          ) as HTMLElement;
                          editorTab?.click();
                        }}
                        size="sm"
                        className="w-full"
                      >
                        Try Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No challenges found for the selected filters.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="glass-card border-border/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <tutorial.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {tutorial.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Topics covered:</h4>
                      <ul className="space-y-1">
                        {tutorial.topics.map((topic, topicIndex) => (
                          <li
                            key={topicIndex}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Reference */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space font-semibold text-xl mb-4">
                Algorithm Complexity Quick Reference
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2 text-success">
                    Common Time Complexities
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>O(1) - Constant time</li>
                    <li>O(log n) - Logarithmic time</li>
                    <li>O(n) - Linear time</li>
                    <li>O(n log n) - Linearithmic time</li>
                    <li>O(n²) - Quadratic time</li>
                    <li>O(2ⁿ) - Exponential time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-warning">
                    Sorting Algorithms
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Bubble Sort: O(n²)</li>
                    <li>Selection Sort: O(n²)</li>
                    <li>Insertion Sort: O(n²)</li>
                    <li>Merge Sort: O(n log n)</li>
                    <li>Quick Sort: O(n log n)</li>
                    <li>Heap Sort: O(n log n)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-primary">
                    Data Structure Operations
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Array Access: O(1)</li>
                    <li>Linked List Search: O(n)</li>
                    <li>Stack Push/Pop: O(1)</li>
                    <li>Queue Enqueue/Dequeue: O(1)</li>
                    <li>BST Search: O(log n)</li>
                    <li>Hash Table: O(1) average</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CodingPractice;
