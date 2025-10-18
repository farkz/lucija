import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { RepertoireItem, User } from "@shared/schema";

const CATEGORY_LABELS = {
  opera_role: "Opera Roles",
  concert_work: "Concert Works",
  conductor: "Conductors",
  orchestra: "Orchestras",
  venue: "Venues",
};

export default function AdminRepertoire() {
  const { user, isLoading: authLoading } = useAuth() as { user: User | null; isLoading: boolean };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RepertoireItem | null>(null);
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [order, setOrder] = useState("");

  const { data: items, isLoading } = useQuery<RepertoireItem[]>({
    queryKey: ["/api/admin/repertoire"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; subtitle?: string; category: string; order: number }) => {
      await apiRequest("POST", "/api/admin/repertoire", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/repertoire"] });
      queryClient.invalidateQueries({ queryKey: ["/api/repertoire"] });
      closeDialog();
      toast({
        title: "Item created",
        description: "The repertoire item has been added successfully.",
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
    mutationFn: async ({ id, data }: { id: string; data: { title: string; subtitle?: string; category: string; order: number } }) => {
      await apiRequest("PUT", `/api/admin/repertoire/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/repertoire"] });
      queryClient.invalidateQueries({ queryKey: ["/api/repertoire"] });
      closeDialog();
      toast({
        title: "Item updated",
        description: "The repertoire item has been updated successfully.",
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
      await apiRequest("DELETE", `/api/admin/repertoire/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/repertoire"] });
      queryClient.invalidateQueries({ queryKey: ["/api/repertoire"] });
      toast({
        title: "Item deleted",
        description: "The repertoire item has been removed successfully.",
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

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setTitle("");
    setSubtitle("");
    setCategory("");
    setOrder("");
  };

  const handleEdit = (item: RepertoireItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSubtitle(item.subtitle || "");
    setCategory(item.category);
    setOrder(item.order.toString());
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!title.trim() || !category || !order.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Strict validation: must be a whole number with no decimals or scientific notation
    if (!/^\d+$/.test(order.trim())) {
      toast({
        title: "Validation Error",
        description: "Order must be a positive whole number.",
        variant: "destructive",
      });
      return;
    }

    const orderNum = parseInt(order, 10);
    if (isNaN(orderNum) || orderNum < 0) {
      toast({
        title: "Validation Error",
        description: "Order must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      title,
      subtitle: subtitle.trim() || undefined,
      category,
      order: orderNum,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
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

  const groupedItems = items?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RepertoireItem[]>) || {};

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
              Manage Repertoire
            </h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) closeDialog();
            setIsDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-item">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="dialog-repertoire-form">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update repertoire item details." : "Add a new item to your repertoire."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title *</label>
                  <Input
                    placeholder="e.g., Carmen (Bizet), Verdi Requiem, Riccardo Muti"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subtitle</label>
                  <Input
                    placeholder="e.g., Role: Carmen, Conductor: Zubin Mehta"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    data-testid="input-subtitle"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opera_role">Opera Roles</SelectItem>
                      <SelectItem value="concert_work">Concert Works</SelectItem>
                      <SelectItem value="conductor">Conductors</SelectItem>
                      <SelectItem value="orchestra">Orchestras</SelectItem>
                      <SelectItem value="venue">Venues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order *</label>
                  <Input
                    type="number"
                    placeholder="Display order (e.g., 1, 2, 3)"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    data-testid="input-order"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={closeDialog} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading repertoire items...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(CATEGORY_LABELS).map(([categoryKey, categoryLabel]) => {
              const categoryItems = groupedItems[categoryKey] || [];
              return (
                <Card key={categoryKey}>
                  <CardHeader>
                    <CardTitle className="text-xl font-light">{categoryLabel}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryItems.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No items in this category yet.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Subtitle</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryItems
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                              <TableRow key={item.id} data-testid={`row-item-${item.id}`}>
                                <TableCell className="font-medium">{item.order}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell className="text-muted-foreground">{item.subtitle || "—"}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEdit(item)}
                                      data-testid={`button-edit-${item.id}`}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to delete this item?")) {
                                          deleteMutation.mutate(item.id);
                                        }
                                      }}
                                      data-testid={`button-delete-${item.id}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
