import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Edit, Upload } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { BlogPost, User } from "@shared/schema";

export default function AdminBlog() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog/posts"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; excerpt?: string; imageUrl?: string; published: boolean }) => {
      await apiRequest("POST", "/api/admin/blog/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Blog post created",
        description: "The blog post has been added successfully.",
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      await apiRequest("PUT", `/api/admin/blog/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully.",
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been removed successfully.",
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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setImageUrl("");
    setPublished(false);
    setEditingPost(null);
  };

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content);
      setExcerpt(post.excerpt || "");
      setImageUrl(post.imageUrl || "");
      setPublished(post.published);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      title,
      content,
      excerpt: excerpt || undefined,
      imageUrl: imageUrl || undefined,
      published,
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const { uploadURL } = await response.json();
    return {
      method: "PUT" as const,
      url: uploadURL,
    };
  };

  const handleImageComplete = async (result: any) => {
    if (result.successful && result.successful[0]) {
      const uploadURL = result.successful[0].uploadURL;
      const response = await apiRequest("PUT", "/api/objects/finalize", {
        objectURL: uploadURL,
      });
      const { objectPath } = await response.json();
      setImageUrl(objectPath);
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully.",
      });
    }
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-light tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
              Manage Blog
            </h1>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-post">
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-post">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Blog post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt</label>
                <Textarea
                  placeholder="Short summary (optional)"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  data-testid="input-excerpt"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="Blog post content (supports markdown)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  data-testid="input-content"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Featured Image</label>
                {imageUrl && (
                  <div className="mb-4">
                    <img
                      src={imageUrl}
                      alt="Featured"
                      className="w-full max-h-48 object-cover rounded-md"
                      data-testid="image-featured-preview"
                    />
                  </div>
                )}
                <ObjectUploader
                  onGetUploadParameters={handleImageUpload}
                  onComplete={handleImageComplete}
                  maxNumberOfFiles={1}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imageUrl ? "Change Image" : "Upload Image"}
                </ObjectUploader>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                  data-testid="switch-published"
                />
                <label className="text-sm font-medium">
                  {published ? "Published" : "Draft"}
                </label>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
                data-testid="button-submit-post"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingPost
                  ? "Update Post"
                  : "Create Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading blog posts...</div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No blog posts yet. Add your first post to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Excerpt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt || "No excerpt"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(post)}
                            data-testid={`button-edit-post-${post.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(post.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-post-${post.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
