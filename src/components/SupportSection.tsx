import { Heart } from "lucide-react";
import gpayQR from "@/assets/gpay-qr.jpeg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SupportSection = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
        >
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Support AlgoLearn
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-sm">
            This platform is completely free and built with love! If you find it helpful in your 
            learning journey, consider supporting us with a small contribution. Your support helps 
            cover server, database, and domain expenses — keeping AlgoLearn running for everyone.
          </p>
          
          {/* QR Code */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-md">
              <img 
                src={gpayQR} 
                alt="GPay QR Code - Aditya Kulkarni" 
                className="w-40 h-40 object-contain rounded-lg"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Aditya Kulkarni</p>
              <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground/80 italic text-center">
            No obligation at all — pay what you want, or nothing at all. Every bit helps! 💙
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportSection;
