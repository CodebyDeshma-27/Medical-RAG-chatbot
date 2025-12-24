import { MapPin, Star, Navigation, Phone } from "lucide-react";
import { Hospital } from "@shared/schema";

interface HospitalMapProps {
  hospitals?: Hospital[];
  isLoading?: boolean;
}

export function HospitalMap({ hospitals = [], isLoading }: HospitalMapProps) {
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-secondary/30 rounded-lg border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Loading hospitals...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Map Placeholder */}
      <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-border flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">Map view - Nearby hospitals</p>
        </div>
      </div>

      {/* Hospitals List */}
      <div className="space-y-2">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="p-4 bg-white dark:bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            data-testid={`card-hospital-${hospital.id}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{hospital.address}</p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500 shrink-0">
                <Star className="w-3 h-3 fill-current" />
                <span>{hospital.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-1 text-primary font-medium text-sm">
                <Navigation className="w-4 h-4" />
                <span>{hospital.distance}</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors"
                data-testid={`button-directions-${hospital.id}`}
              >
                <Phone className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
