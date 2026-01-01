import { useEffect, useState } from "react";

const WelcomeSection = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon"; 
    return "Good Evening";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "\"The only way to learn a new programming language is by writing programs in it.\" - Dennis Ritchie",
      "\"Algorithms + Data Structures = Programs.\" - Niklaus Wirth",
      "\"Talk is cheap. Show me the code.\" - Linus Torvalds",
      "\"The best way to learn is to practice.\" - Anonymous",
      "\"Code is like humor. When you have to explain it, it's bad.\" - Cory House"
    ];
    
    const today = new Date().getDate();
    return quotes[today % quotes.length];
  };

  return (
    <div className="relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb w-64 h-64 top-10 -right-20"></div>
      <div className="floating-orb w-48 h-48 -top-10 left-20 animation-delay-1000"></div>
      
      <div className="relative glass-card rounded-3xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-space font-bold heading-gradient mb-2">
                {getGreeting()}, Learner! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Ready to dive into Data Structures and Algorithms?
              </p>
            </div>
            
            <div className="glass-card rounded-xl p-4 bg-accent/10 border-accent/20">
              <p className="text-sm text-foreground/90 italic leading-relaxed">
                {getMotivationalQuote()}
              </p>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 text-center lg:text-right">
            <div className="glass-card rounded-xl p-4 bg-primary/10 border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Current Time</p>
              <p className="text-xl font-mono font-semibold text-primary-glow">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
