import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { StructuredData, generateBlogPostSchema } from "@/lib/structuredData";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string | null;
}

export default function BlogPost() {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", id],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Blog post not found</p>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={generateBlogPostSchema(post)} />
      
      <Header isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="pt-16">
        <article className="px-6 py-12" data-testid="article-blog-post">
          <div className="max-w-prose mx-auto">
            <Link href="/">
              <Button variant="ghost" className="mb-6" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            {post.imageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  data-testid="img-blog-featured"
                />
              </div>
            )}

            <h1 className="font-serif text-3xl font-light mb-4" data-testid="text-blog-title">
              {post.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Calendar className="w-4 h-4" />
              <time data-testid="text-blog-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <div 
              className="prose prose-invert max-w-none"
              data-testid="text-blog-content"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {post.content}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
