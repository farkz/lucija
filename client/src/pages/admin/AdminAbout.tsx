import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { AboutContent, User } from "@shared/schema";

export default function AdminAbout() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [content, setContent] = useState("");

  const { data: aboutData, isLoading } = useQuery<AboutContent>({
    queryKey: ["/api/about"],
  });

  useEffect(() => {
    if (aboutData?.content) {
      setContent(aboutData.content);
    }
  }, [aboutData]);

  const updateMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      await apiRequest("PUT", "/api/admin/about", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/about"] });
      toast({
        title: "About content updated",
        description: "The about section has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need admin privileges to perform this action.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({ content });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-light tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
              Edit About Content
            </h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-testid="button-save"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading content...</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">About Content</label>
                  <Textarea
                    placeholder="Enter about content (supports markdown)..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="textarea-content"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This content will be displayed in the About section of the website.
                    You can use markdown formatting for rich text.
                  </p>
                </div>

                {content && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preview</label>
                    <Card>
                      <CardContent className="p-6">
                        <div className="prose prose-sm max-w-none" data-testid="preview-content">
                          {content.split('\n').map((paragraph, index) => (
                            paragraph.trim() ? (
                              <p key={index} className="mb-4">{paragraph}</p>
                            ) : null
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
