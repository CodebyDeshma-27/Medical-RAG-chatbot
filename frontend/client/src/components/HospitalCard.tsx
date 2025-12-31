import { Hospital } from "@/hooks/use-medcite";
import { cn } from "@/lib/utils";
import { MapPin, Star, Navigation } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {hospital.name}
        </h3>
        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500 border border-yellow-100 dark:border-yellow-900/30">
          <span>{hospital.rating}</span>
          <Star className="w-3 h-3 fill-current" />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {hospital.address}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1 text-xs text-primary font-medium">
          <Navigation className="w-3 h-3" />
          <span>{hospital.distance} away</span>
        </div>
        
        <button className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors font-medium">
          Directions
        </button>
      </div>
    </div>
  );
}
