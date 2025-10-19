import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date | string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="px-6 py-12" data-testid="section-blog">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl font-light mb-6" data-testid="text-blog-heading">
          Latest News
        </h2>
        
        <div className="space-y-6">
          {posts.slice(0, 3).map((post) => (
            <Card key={post.id} className="p-6" data-testid={`card-blog-${post.id}`}>
              {post.imageUrl && (
                <div className="aspect-video rounded overflow-hidden mb-4">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h3 className="font-medium text-lg mb-2" data-testid={`text-blog-title-${post.id}`}>
                {post.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                <time data-testid={`text-blog-date-${post.id}`}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              {post.excerpt && (
                <p className="text-muted-foreground mb-4" data-testid={`text-blog-excerpt-${post.id}`}>
                  {post.excerpt}
                </p>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <Link href={`/blog/${post.id}`} data-testid={`link-read-more-${post.id}`}>
                  Read More
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
