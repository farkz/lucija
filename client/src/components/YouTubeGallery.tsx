import { StructuredData, generateVideoSchema } from "@/lib/structuredData";

export interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  createdAt?: Date | string;
  order?: number;
}

interface YouTubeGalleryProps {
  videos: YouTubeVideo[];
}

export default function YouTubeGallery({ videos }: YouTubeGalleryProps) {
  return (
    <section id="gallery" className="px-6 py-12 bg-card" data-testid="section-gallery">
      {/* Structured Data for SEO */}
      {videos.map((video) => (
        <StructuredData
          key={video.id}
          data={generateVideoSchema({
            ...video,
            createdAt: video.createdAt || new Date().toISOString(),
            order: video.order || 0
          })}
        />
      ))}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl font-light mb-6" data-testid="text-gallery-heading">
          Archive / YouTube Gallery
        </h2>
        
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-center py-12" data-testid="text-gallery-empty">
            No videos available at this time.
          </p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden hover-elevate active-elevate-2"
                data-testid={`link-video-${video.id}`}
              >
                <div className="relative aspect-video bg-muted">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-card">
                  <h3 className="font-medium" data-testid={`text-video-title-${video.id}`}>
                    {video.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
