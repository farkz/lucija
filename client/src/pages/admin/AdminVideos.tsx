import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { YoutubeVideo, User } from "@shared/schema";

export default function AdminVideos() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [order, setOrder] = useState("");

  const { data: videos, isLoading } = useQuery<YoutubeVideo[]>({
    queryKey: ["/api/videos"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; videoId: string; thumbnailUrl: string; order: string }) => {
      await apiRequest("POST", "/api/admin/videos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Video created",
        description: "The video has been added successfully.",
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
      await apiRequest("DELETE", `/api/admin/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "Video deleted",
        description: "The video has been removed successfully.",
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
    setVideoId("");
    setThumbnailUrl("");
    setOrder("");
  };

  const handleCreate = () => {
    if (!title.trim() || !videoId.trim() || !thumbnailUrl.trim() || !order.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ title, videoId, thumbnailUrl, order });
  };

  const extractVideoId = (input: string) => {
    // Extract video ID from YouTube URL or use as-is
    const urlMatch = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return urlMatch ? urlMatch[1] : input;
  };

  const handleVideoIdChange = (value: string) => {
    const extracted = extractVideoId(value);
    setVideoId(extracted);
    // Auto-generate thumbnail URL
    if (extracted) {
      setThumbnailUrl(`https://img.youtube.com/vi/${extracted}/maxresdefault.jpg`);
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
              Manage Videos
            </h1>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-video">
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent data-testid="dialog-add-video">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a YouTube video by pasting the URL or video ID.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">YouTube URL or Video ID</label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or video ID"
                  value={videoId}
                  onChange={(e) => handleVideoIdChange(e.target.value)}
                  data-testid="input-video-id"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Paste full YouTube URL or just the video ID
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Thumbnail URL</label>
                <Input
                  placeholder="Thumbnail URL (auto-filled)"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  data-testid="input-thumbnail"
                />
              </div>
              {thumbnailUrl && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Preview</label>
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full rounded-md"
                    data-testid="image-thumbnail-preview"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-2 block">Order</label>
                <Input
                  placeholder="Display order (e.g., 1, 2, 3)"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  data-testid="input-order"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="w-full"
                data-testid="button-submit-video"
              >
                {createMutation.isPending ? "Creating..." : "Create Video"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading videos...</div>
            ) : !videos || videos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No videos yet. Add your first video to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Video ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id} data-testid={`row-video-${video.id}`}>
                      <TableCell>
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{video.title}</TableCell>
                      <TableCell className="font-mono text-sm">{video.videoId}</TableCell>
                      <TableCell>{video.order}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(video.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-video-${video.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
