import { Calendar, MapPin, Music } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface Event {
  id: string;
  date: string;
  venue: string;
  orchestra: string;
  description?: string | null;
  images: string[];
}

interface EventCardProps {
  event: Event;
  onImageClick: (imageUrl: string) => void;
}

export default function EventCard({ event, onImageClick }: EventCardProps) {
  return (
    <Card className="p-6 space-y-4" data-testid={`card-event-${event.id}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span data-testid={`text-event-date-${event.id}`}>{event.date}</span>
        </div>
        <h3 className="font-medium text-lg" data-testid={`text-event-venue-${event.id}`}>
          {event.venue}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Music className="w-4 h-4" />
          <span data-testid={`text-event-orchestra-${event.id}`}>{event.orchestra}</span>
        </div>
        {event.description && (
          <p className="text-sm text-muted-foreground mt-2" data-testid={`text-event-description-${event.id}`}>
            {event.description}
          </p>
        )}
      </div>

      {event.images && event.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {event.images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => onImageClick(image)}
              className="aspect-square rounded overflow-hidden hover-elevate active-elevate-2"
              data-testid={`button-event-image-${event.id}-${index}`}
            >
              <img
                src={image}
                alt={`${event.venue} - Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
