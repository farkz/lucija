import { useState } from "react";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import YouTubeGallery from "@/components/YouTubeGallery";
import ImageModal from "@/components/ImageModal";
import heroImage from "@assets/generated_images/Opera_singer_portrait_photo_505a6c64.png";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const reviews = [
    {
      quote: "A voice of extraordinary beauty and technical mastery",
      author: "The New York Times"
    },
    {
      quote: "Ercegovac's performance was nothing short of magnificent",
      author: "Opera Magazine"
    },
    {
      quote: "Her portrayal brought tears to the audience's eyes",
      author: "Classical Music Review"
    }
  ];

  const aboutContent = `Lucija Ercegovac is an internationally acclaimed opera singer whose performances have captivated audiences across Europe and beyond. Her powerful yet nuanced voice has made her a sought-after performer in the world's most prestigious opera houses.

Born in Croatia, Lucija began her musical education at the Zagreb Academy of Music, where she studied under renowned vocal pedagogue Dunja Vejzović. She later continued her studies at the Royal Academy of Music in London, graduating with distinction.

Her repertoire spans from baroque to contemporary opera, with particular acclaim for her interpretations of Verdi, Puccini, and Mozart. Lucija has performed leading roles at the Vienna State Opera, La Scala, and the Royal Opera House.`;

  const upcomingEvents = [
    {
      id: "1",
      date: "April 20, 2024",
      venue: "La Scala, Milan",
      orchestra: "Orchestra del Teatro alla Scala",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400"
      ]
    },
    {
      id: "2",
      date: "May 5, 2024",
      venue: "Royal Opera House, London",
      orchestra: "Royal Opera House Orchestra",
      images: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
      ]
    }
  ];

  const pastEvents = [
    {
      id: "3",
      date: "January 15, 2024",
      venue: "Vienna State Opera",
      orchestra: "Vienna Philharmonic Orchestra",
      images: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
      ]
    }
  ];

  const youtubeVideos = [
    {
      id: "1",
      title: "La Traviata - Sempre libera",
      videoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800"
    },
    {
      id: "2",
      title: "Don Giovanni - Or sai chi l'onore",
      videoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="pt-16">
        <HeroSection imageSrc={heroImage} reviews={reviews} />
        <AboutSection content={aboutContent} />
        <EventsSection
          title="Upcoming Events"
          events={upcomingEvents}
          sectionId="upcoming"
          onImageClick={setSelectedImage}
        />
        <EventsSection
          title="Past Events"
          events={pastEvents}
          sectionId="past-events"
          onImageClick={setSelectedImage}
        />
        <YouTubeGallery videos={youtubeVideos} />
      </main>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
