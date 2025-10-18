import EventsSection from "../EventsSection";

export default function EventsSectionExample() {
  const events = [
    {
      id: "1",
      date: "April 20, 2024",
      venue: "La Scala, Milan",
      orchestra: "Orchestra del Teatro alla Scala",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
      ]
    },
    {
      id: "2",
      date: "May 5, 2024",
      venue: "Royal Opera House, London",
      orchestra: "Royal Opera House Orchestra",
      images: [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400"
      ]
    }
  ];

  return (
    <EventsSection
      title="Upcoming Events"
      events={events}
      sectionId="upcoming"
      onImageClick={(url) => console.log('Image clicked:', url)}
    />
  );
}
