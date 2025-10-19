import { useState, useEffect } from "react";

interface Review {
  quote: string;
  author: string;
}

interface HeroSectionProps {
  imageSrc: string;
  reviews: Review[];
}

export default function HeroSection({ imageSrc, reviews }: HeroSectionProps) {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToReview = (index: number) => {
    setCurrentReview(index);
  };

  return (
    <section id="home" className="relative h-screen w-full" data-testid="section-hero">
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt="Lucija Ercegovac performing opera"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-lg bg-black/30 px-6 py-8">
        <div className="max-w-prose mx-auto">
          <blockquote className="text-lg italic text-foreground mb-2" data-testid="text-review-quote">
            "{reviews[currentReview]?.quote}"
          </blockquote>
          <cite className="text-sm text-muted-foreground not-italic" data-testid="text-review-author">
            — {reviews[currentReview]?.author}
          </cite>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentReview ? "bg-primary w-6" : "bg-muted-foreground/40"
              }`}
              aria-label={`Go to review ${index + 1}`}
              data-testid={`button-review-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
