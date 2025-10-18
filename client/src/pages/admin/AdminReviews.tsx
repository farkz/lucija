import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { Review, User } from "@shared/schema";

export default function AdminReviews() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [order, setOrder] = useState("");

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { quote: string; author: string; order: string }) => {
      await apiRequest("POST", "/api/admin/reviews", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setIsDialogOpen(false);
      setQuote("");
      setAuthor("");
      setOrder("");
      toast({
        title: "Review created",
        description: "The review has been added successfully.",
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
      await apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Review deleted",
        description: "The review has been removed successfully.",
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

  const handleCreate = () => {
    if (!quote.trim() || !author.trim() || !order.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ quote, author, order });
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
              Manage Reviews
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-review">
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-add-review">
              <DialogHeader>
                <DialogTitle>Add New Review</DialogTitle>
                <DialogDescription>
                  Add a press review quote to display on the homepage.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quote</label>
                  <Textarea
                    placeholder="Enter review quote..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    data-testid="input-quote"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    placeholder="Review author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    data-testid="input-author"
                  />
                </div>
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
                  data-testid="button-submit-review"
                >
                  {createMutation.isPending ? "Creating..." : "Create Review"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
            ) : !reviews || reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet. Add your first review to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 italic">"{review.quote}"</p>
                      </TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>{review.order}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(review.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-review-${review.id}`}
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
