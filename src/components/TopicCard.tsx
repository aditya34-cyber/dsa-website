import { LucideIcon } from "lucide-react";

interface TopicCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  estimatedTime: string;
  variant: "sorting" | "searching" | "stacks" | "queues" | "coding";
  onClick: () => void;
}

const difficultyColors = {
  Beginner: "text-success",
  Intermediate: "text-warning", 
  Advanced: "text-destructive",
  "All Levels": "text-primary-glow"
};

const TopicCard = ({ 
  title, 
  description, 
  icon: Icon, 
  difficulty, 
  estimatedTime, 
  variant,
  onClick 
}: TopicCardProps) => {
  return (
    <div 
      className={`topic-card-${variant} group cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-glow active:scale-[0.98] animate-slide-up border border-transparent hover:border-primary/20`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
          <Icon className="h-8 w-8 text-primary-glow" />
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${difficultyColors[difficulty]} transition-all duration-200 inline-block group-hover:scale-105`}>
            {difficulty}
          </span>
          <p className="text-xs text-muted-foreground mt-1">{estimatedTime}</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-space font-semibold text-foreground group-hover:text-primary-glow transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </div>
      
      {/* Action Indicator */}
      <div className="mt-6 flex items-center text-primary-glow group-hover:translate-x-3 transition-all duration-300">
        <span className="text-sm font-medium">Start Learning</span>
        <svg className="ml-2 h-4 w-4 group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default TopicCard;