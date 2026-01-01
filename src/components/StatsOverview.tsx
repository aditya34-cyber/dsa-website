import { TrendingUp, Clock, Target, Award } from "lucide-react";

const StatsOverview = () => {
  const stats = [
    {
      label: "Topics Learned",
      value: "0",
      total: "4",
      icon: Target,
      color: "text-success"
    },
    {
      label: "Time Invested",
      value: "0h",
      total: "∞",
      icon: Clock,
      color: "text-primary-glow"
    },
    {
      label: "Progress",
      value: "0%",
      total: "100%",
      icon: TrendingUp,
      color: "text-warning"
    },
    {
      label: "Achievements",
      value: "0",
      total: "12",
      icon: Award,
      color: "text-accent"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="glass-card rounded-xl p-4 text-center group hover:scale-105 hover:shadow-card active:scale-[0.97] transition-all duration-300 animate-slide-up cursor-default border border-transparent hover:border-primary/10"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex justify-center mb-3">
            <div className="p-2 rounded-lg bg-card/50 group-hover:bg-card/70 group-hover:scale-110 transition-all duration-300">
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:animate-pulse`} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold font-space text-foreground transition-transform group-hover:scale-110 duration-300">
              {stat.value}
              <span className="text-sm text-muted-foreground font-normal">
                /{stat.total}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;