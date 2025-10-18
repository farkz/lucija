import EventCard, { type Event } from "./EventCard";

interface EventsSectionProps {
  title: string;
  events: Event[];
  onImageClick: (imageUrl: string) => void;
  sectionId: string;
}

export default function EventsSection({ title, events, onImageClick, sectionId }: EventsSectionProps) {
  return (
    <section id={sectionId} className="px-6 py-12" data-testid={`section-${sectionId}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl font-light mb-6" data-testid={`text-${sectionId}-heading`}>
          {title}
        </h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-12" data-testid={`text-${sectionId}-empty`}>
            No events to display at this time.
          </p>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onImageClick={onImageClick} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
