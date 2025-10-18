import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import YouTubeGallery, { type YouTubeVideo } from "@/components/YouTubeGallery";
import BlogSection, { type BlogPost } from "@/components/BlogSection";
import ImageModal from "@/components/ImageModal";
import heroImage from "@assets/lu_1760791781256.jpg";

interface Review {
  id: string;
  quote: string;
  author: string;
  order: string;
}

interface AboutContent {
  id: string;
  content: string;
  updatedAt: Date | null;
}

interface EventWithImages {
  id: string;
  date: string;
  venue: string;
  orchestra: string;
  isPast: boolean;
  images: string[];
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Fetch about content
  const { data: aboutData } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
  });

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = useQuery<EventWithImages[]>({
    queryKey: ["/api/events/upcoming"],
  });

  // Fetch past events
  const { data: pastEvents = [] } = useQuery<EventWithImages[]>({
    queryKey: ["/api/events/past"],
  });

  // Fetch YouTube videos
  const { data: youtubeVideos = [] } = useQuery<YouTubeVideo[]>({
    queryKey: ["/api/videos"],
  });

  // Fetch blog posts
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const aboutContent = aboutData?.content || `Lucija Ercegovac is an internationally acclaimed opera singer whose performances have captivated audiences across Europe and beyond. Her powerful yet nuanced voice has made her a sought-after performer in the world's most prestigious opera houses.

Born in Croatia, Lucija began her musical education at the Zagreb Academy of Music, where she studied under renowned vocal pedagogue Dunja Vejzović. She later continued her studies at the Royal Academy of Music in London, graduating with distinction.

Her repertoire spans from baroque to contemporary opera, with particular acclaim for her interpretations of Verdi, Puccini, and Mozart. Lucija has performed leading roles at the Vienna State Opera, La Scala, and the Royal Opera House.`;

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
        <BlogSection posts={blogPosts} />
      </main>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
