import { ArrowUpDown, Search, Layers, GitBranch, Code, LogOut, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import TopicCard from "@/components/TopicCard";
import WelcomeSection from "@/components/WelcomeSection";
import SupportSection from "@/components/SupportSection";
import BubbleSortPreview from "@/components/BubbleSortPreview";
import { Button } from "@/components/ui/button";
import { toast as sonnerToast } from "sonner";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const topics = [
    {
      title: "Sorting Algorithms",
      description: "Explore bubble sort, merge sort, quick sort, and more with step-by-step visualizations.",
      icon: ArrowUpDown,
      difficulty: "Beginner" as const,
      estimatedTime: "2-3 hours",
      variant: "sorting" as const
    },
    {
      title: "Searching Algorithms",
      description: "Master linear search, binary search, and advanced searching techniques.",
      icon: Search,
      difficulty: "Beginner" as const,
      estimatedTime: "1-2 hours",
      variant: "searching" as const
    },
    {
      title: "Stacks",
      description: "Understand LIFO data structure with practical examples and implementations.",
      icon: Layers,
      difficulty: "Intermediate" as const,
      estimatedTime: "2-3 hours",
      variant: "stacks" as const
    },
    {
      title: "Queues",
      description: "Learn FIFO data structure, circular queues, and priority queues.",
      icon: GitBranch,
      difficulty: "Intermediate" as const,
      estimatedTime: "2-3 hours",
      variant: "queues" as const
    },
    {
      title: "Coding Practice",
      description: "Interactive code editor with challenges and project management.",
      icon: Code,
      difficulty: "All Levels" as const,
      estimatedTime: "Unlimited",
      variant: "coding" as const
    }
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) sonnerToast.error("Error logging out");
    else sonnerToast.success("Logged out successfully!");
  };

  const handleTopicClick = (topicTitle: string) => {
    if (topicTitle === "Sorting Algorithms") navigate("/sorting");
    else if (topicTitle === "Searching Algorithms") navigate("/searching");
    else if (topicTitle === "Stacks") navigate("/stacks");
    else if (topicTitle === "Queues") navigate("/queues");
    else if (topicTitle === "Coding Practice") navigate("/coding-practice");
    else {
      toast({
        title: `${topicTitle} Coming Soon!`,
        description: "This feature is currently under development.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100svh] md:min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // ---------- NON-AUTH VIEW ----------
  if (!user) {
    return (
      <div className="min-h-[100svh] md:min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER — FIXED */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <Code className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-space font-bold heading-gradient">AlgoLearn</h1>
            </div>
            <Button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-glow"
            >
              <LogIn className="h-4 w-4" />
              Login / Sign Up
            </Button>
          </div>

          {/* HERO CARD — FIXED */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-space font-bold heading-gradient mb-4">
              Welcome to AlgoLearn! 👋
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master Data Structures and Algorithms with interactive visualizations.
              Get a taste of what we offer with this Bubble Sort preview!
            </p>
          </div>

          <BubbleSortPreview />
        </div>
      </div>
    );
  }

  // ---------- AUTH VIEW ----------
  return (
    <div className="min-h-[100svh] md:min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-end gap-2 mb-4">
          <SupportSection />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <WelcomeSection />

        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-space font-bold heading-gradient">
              Choose Your Learning Path
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Master the fundamentals with interactive visualizations and real-time execution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <div key={topic.title} style={{ animationDelay: `${index * 150}ms` }}>
                <TopicCard {...topic} onClick={() => handleTopicClick(topic.title)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-6 bg-accent/5 border-accent/10">
            <h3 className="text-lg font-space font-semibold mb-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Pick any topic above to begin your interactive learning experience.
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <span>🎯 Interactive</span>
              <span>⚡ Real-time</span>
              <span>📚 Theory</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
