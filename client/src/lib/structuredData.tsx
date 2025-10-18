/**
 * Structured Data (Schema.org JSON-LD) utilities for SEO
 * Helps Google understand and display content in rich results
 */

import type { Event, BlogPost, YoutubeVideo } from "@shared/schema";

/**
 * Normalize date to ISO string format
 */
function toISOString(date: Date | string | null): string | undefined {
  if (!date) return undefined;
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Generate Event schema for performances
 * https://schema.org/Event
 */
export function generateEventSchema(event: Event & { images?: string[] }) {
  const startDate = toISOString(event.date);
  
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "name": `${event.orchestra} at ${event.venue}`,
    "description": event.description || `Opera performance featuring Lucija Ercegovac at ${event.venue}`,
    "startDate": startDate,
    "location": {
      "@type": "Place",
      "name": event.venue,
      "address": {
        "@type": "PostalAddress",
        "name": event.venue,
      }
    },
    "performer": {
      "@type": "Person",
      "name": "Lucija Ercegovac",
      "jobTitle": "Opera Singer",
      "url": "https://lucijaercegovac.com"
    },
    "organizer": {
      "@type": "PerformingGroup",
      "name": event.orchestra
    },
    ...(event.images && event.images.length > 0 && {
      "image": event.images
    }),
    "eventStatus": event.isPast ? "https://schema.org/EventScheduled" : "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };
}

/**
 * Generate Person schema for artist profile
 * https://schema.org/Person
 */
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Lucija Ercegovac",
    "jobTitle": "Opera Singer",
    "description": "Professional opera singer performing at venues worldwide",
    "url": "https://lucijaercegovac.com",
    "sameAs": [
      "https://instagram.com/luercegovac"
    ],
    "knowsAbout": ["Opera", "Classical Music", "Vocal Performance"],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Opera Singer",
      "occupationalCategory": "Performing Arts"
    }
  };
}

/**
 * Sanitize and limit text for schema descriptions
 */
function sanitizeDescription(text: string, maxLength: number = 155): string {
  // Remove markdown syntax and extra whitespace
  const cleaned = text
    .replace(/[#*_`\[\]]/g, '') // Remove markdown symbols
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Limit to maxLength and add ellipsis if needed
  return cleaned.length > maxLength 
    ? cleaned.substring(0, maxLength).trim() + '...'
    : cleaned;
}

/**
 * Generate BlogPosting schema for blog posts
 * https://schema.org/BlogPosting
 */
export function generateBlogPostSchema(post: Omit<BlogPost, 'createdAt' | 'updatedAt'> & { createdAt: Date | string | null; updatedAt: Date | string | null; }) {
  const description = post.excerpt 
    ? sanitizeDescription(post.excerpt, 155)
    : sanitizeDescription(post.content, 155);
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": description,
    "url": `https://lucijaercegovac.com/blog/${post.id}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lucijaercegovac.com/blog/${post.id}`
    },
    "author": {
      "@type": "Person",
      "name": "Lucija Ercegovac",
      "url": "https://lucijaercegovac.com"
    },
    "datePublished": toISOString(post.createdAt),
    "dateModified": toISOString(post.updatedAt || post.createdAt),
    ...(post.imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": post.imageUrl
      }
    }),
    "publisher": {
      "@type": "Person",
      "name": "Lucija Ercegovac",
      "url": "https://lucijaercegovac.com"
    }
  };
}

/**
 * Generate VideoObject schema for YouTube videos
 * https://schema.org/VideoObject
 */
export function generateVideoSchema(video: Omit<YoutubeVideo, 'createdAt'> & { createdAt: Date | string | null; }) {
  const description = sanitizeDescription(`Opera performance by Lucija Ercegovac: ${video.title}`, 155);
  
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": description,
    "thumbnailUrl": [video.thumbnailUrl],
    "uploadDate": toISOString(video.createdAt),
    "contentUrl": `https://www.youtube.com/watch?v=${video.videoId}`,
    "embedUrl": `https://www.youtube.com/embed/${video.videoId}`,
    "publisher": {
      "@type": "Person",
      "name": "Lucija Ercegovac",
      "url": "https://lucijaercegovac.com"
    }
  };
}

/**
 * Generate Organization schema for homepage
 * https://schema.org/Organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "PerformingGroup",
    "name": "Lucija Ercegovac",
    "alternateName": "Lucija Ercegovac - Opera Singer",
    "url": "https://lucijaercegovac.com",
    "logo": "https://lucijaercegovac.com/og-image.jpg",
    "description": "Professional opera singer performing at venues worldwide",
    "genre": "Opera",
    "sameAs": [
      "https://instagram.com/luercegovac"
    ]
  };
}

/**
 * Component to inject JSON-LD structured data into page head
 */
export function StructuredData({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
