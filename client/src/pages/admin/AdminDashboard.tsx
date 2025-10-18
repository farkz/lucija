import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Calendar, 
  Video, 
  FileText, 
  User as UserIcon,
  ArrowLeft 
} from "lucide-react";
import type { User } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth() as { user: User | null; isLoading: boolean };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription className="mb-4">
              Please sign in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full"
              data-testid="button-login"
            >
              Sign in with Replit
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You are logged in as {user.email}, but you need admin privileges to access this page.
              Please contact the site administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const adminSections = [
    {
      title: "Reviews",
      description: "Manage testimonials and reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
      testId: "link-admin-reviews"
    },
    {
      title: "Events",
      description: "Manage upcoming and past events with images",
      icon: Calendar,
      href: "/admin/events",
      testId: "link-admin-events"
    },
    {
      title: "Videos",
      description: "Manage YouTube video gallery",
      icon: Video,
      href: "/admin/videos",
      testId: "link-admin-videos"
    },
    {
      title: "Blog",
      description: "Manage blog posts and publications",
      icon: FileText,
      href: "/admin/blog",
      testId: "link-admin-blog"
    },
    {
      title: "About",
      description: "Edit about content",
      icon: UserIcon,
      href: "/admin/about",
      testId: "link-admin-about"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName || user.email}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={section.testId}>
                  <CardHeader className="gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
