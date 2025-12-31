import { useEffect, useRef } from "react";
import { MapPin, Star, Navigation, Phone } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";
import { Hospital } from "@shared/schema";

interface HospitalMapProps {
  hospitals?: Hospital[];
  isLoading?: boolean;
}

export function HospitalMap({ hospitals = [], isLoading }: HospitalMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || hospitals.length === 0) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (!window.google) return;

      const center = {
        lat: hospitals[0].lat,
        lng: hospitals[0].lng,
      };

      const map = new google.maps.Map(mapRef.current!, {
        center,
        zoom: 13,
      });

      hospitals.forEach((hospital) => {
        new google.maps.Marker({
          position: {
            lat: hospital.lat,
            lng: hospital.lng,
          },
          map,
          title: hospital.name,
        });
      });
    });
  }, [hospitals]);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-secondary/30 rounded-lg border border-border flex items-center justify-center">
        <p className="text-muted-foreground">Loading hospitals...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* ✅ REAL GOOGLE MAP */}
      <div
        ref={mapRef}
        className="w-full h-80 rounded-lg border border-border"
      />

      {/* Hospitals List (UNCHANGED) */}
      <div className="space-y-2">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="p-4 bg-white dark:bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {hospital.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hospital.address}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-xs font-medium text-yellow-700 dark:text-yellow-500">
                <Star className="w-3 h-3 fill-current" />
                <span>{hospital.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-1 text-primary font-medium text-sm">
                <Navigation className="w-4 h-4" />
                <span>{hospital.distance}</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium">
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
