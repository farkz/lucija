import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventsSection from "@/components/EventsSection";
import YouTubeGallery, { type YouTubeVideo } from "@/components/YouTubeGallery";
import BlogSection, { type BlogPost } from "@/components/BlogSection";
import ImageModal from "@/components/ImageModal";
import heroImage from "@assets/hero-lucija.jpg";
import { SiInstagram } from "react-icons/si";
import { StructuredData, generateOrganizationSchema, generatePersonSchema, generateEventSchema } from "@/lib/structuredData";

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
  description: string | null;
  isPast: boolean;
  createdAt: Date | null;
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
      <SEO />
      
      {/* Preload critical hero image for faster LCP */}
      <Helmet>
        <link rel="preload" as="image" href={heroImage} fetchPriority="high" />
      </Helmet>
      
      {/* Structured Data for SEO */}
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generatePersonSchema()} />
      {upcomingEvents.slice(0, 5).map((event) => (
        <StructuredData key={event.id} data={generateEventSchema(event)} />
      ))}
      
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

      <footer className="border-t py-8 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <a
            href="https://instagram.com/luercegovac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover-elevate active-elevate-2 p-3 rounded-md transition-colors"
            aria-label="Follow Lucija Ercegovac on Instagram"
            data-testid="link-instagram"
          >
            <SiInstagram className="w-6 h-6" />
          </a>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lucija Ercegovac. All rights reserved.
          </p>
        </div>
      </footer>

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
