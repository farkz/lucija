import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Edit, Upload, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Event, User } from "@shared/schema";

interface EventWithImages extends Event {
  images?: string[];
}

export default function AdminEvents() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventWithImages | null>(null);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [orchestra, setOrchestra] = useState("");
  const [description, setDescription] = useState("");
  const [isPast, setIsPast] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const { data: events, isLoading } = useQuery<EventWithImages[]>({
    queryKey: ["/api/admin/events"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { date: string; venue: string; orchestra: string; description?: string; isPast: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/events", data);
      return response.json();
    },
    onSuccess: async (newEvent) => {
      // Create event images if any were uploaded
      if (uploadedImages.length > 0) {
        for (let i = 0; i < uploadedImages.length; i++) {
          await apiRequest("POST", "/api/admin/event-images", {
            eventId: newEvent.id,
            imageUrl: uploadedImages[i],
            order: String(i + 1),
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Event created",
        description: "The event has been added successfully.",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      await apiRequest("PUT", `/api/admin/events/${id}`, data);
    },
    onSuccess: async (_data, variables) => {
      // Handle image updates
      if (editingEvent && uploadedImages.length > 0) {
        const existingImages = editingEvent.images || [];
        const newImages = uploadedImages.filter(img => !existingImages.includes(img));
        
        // Add new images to event_images table
        for (let i = 0; i < newImages.length; i++) {
          await apiRequest("POST", "/api/admin/event-images", {
            eventId: variables.id,
            imageUrl: newImages[i],
            order: existingImages.length + i + 1,
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
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
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Event deleted",
        description: "The event has been removed successfully.",
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
    setDate("");
    setVenue("");
    setOrchestra("");
    setDescription("");
    setIsPast(false);
    setUploadedImages([]);
    setEditingEvent(null);
  };

  const handleOpenDialog = (event?: EventWithImages) => {
    if (event) {
      setEditingEvent(event);
      setDate(event.date);
      setVenue(event.venue);
      setOrchestra(event.orchestra);
      setDescription(event.description || "");
      setIsPast(event.isPast);
      setUploadedImages(event.images || []);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!date.trim() || !venue.trim() || !orchestra.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const data = { date, venue, orchestra, description: description || undefined, isPast };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
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
      setUploadedImages((prev) => [...prev, objectPath]);
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully.",
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
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
              Manage Events
            </h1>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-add-event">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-event">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
              <DialogDescription>
                {editingEvent ? "Update the event details below." : "Fill in the details to create a new event."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Input
                  placeholder="e.g., March 15, 2024"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  data-testid="input-date"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Venue</label>
                <Input
                  placeholder="Concert hall name"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  data-testid="input-venue"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Orchestra</label>
                <Input
                  placeholder="Orchestra name"
                  value={orchestra}
                  onChange={(e) => setOrchestra(e.target.value)}
                  data-testid="input-orchestra"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                <Textarea
                  placeholder="Short description of the event"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  data-testid="textarea-description"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isPast}
                  onCheckedChange={setIsPast}
                  data-testid="switch-is-past"
                />
                <label className="text-sm font-medium">Mark as past event</label>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Event Images</label>
                <div className="space-y-4">
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="relative" data-testid={`image-preview-${index}`}>
                          <img
                            src={imageUrl}
                            alt={`Event ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage(index)}
                            data-testid={`button-remove-image-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <ObjectUploader
                    onGetUploadParameters={handleImageUpload}
                    onComplete={handleImageComplete}
                    maxNumberOfFiles={4}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </ObjectUploader>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
                data-testid="button-submit-event"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingEvent
                  ? "Update Event"
                  : "Create Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading events...</div>
            ) : !events || events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events yet. Add your first event to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Orchestra</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} data-testid={`row-event-${event.id}`}>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>{event.orchestra}</TableCell>
                      <TableCell>
                        <span className={event.isPast ? "text-muted-foreground" : "text-primary"}>
                          {event.isPast ? "Past" : "Upcoming"}
                        </span>
                      </TableCell>
                      <TableCell>{event.images?.length || 0} images</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(event)}
                            data-testid={`button-edit-event-${event.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(event.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-event-${event.id}`}
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
