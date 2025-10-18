import EventCard from "../EventCard";

export default function EventCardExample() {
  const event = {
    id: "1",
    date: "March 15, 2024",
    venue: "Vienna State Opera",
    orchestra: "Vienna Philharmonic Orchestra",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400"
    ]
  };

  return (
    <div className="p-4">
      <EventCard 
        event={event} 
        onImageClick={(url) => console.log('Image clicked:', url)} 
      />
    </div>
  );
}
