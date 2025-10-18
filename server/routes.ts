import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import { insertReviewSchema, insertEventSchema, insertEventImageSchema, insertYoutubeVideoSchema, insertBlogPostSchema, insertAboutContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Object Storage routes
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.post("/api/objects/upload", isAuthenticated, isAdmin, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.put("/api/objects/finalize", isAuthenticated, isAdmin, async (req, res) => {
    if (!req.body.objectURL) {
      return res.status(400).json({ error: "objectURL is required" });
    }

    const userId = (req.user as any)?.claims?.sub;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.objectURL,
        {
          owner: userId,
          visibility: "public",
        },
      );

      res.status(200).json({
        objectPath: objectPath,
      });
    } catch (error) {
      console.error("Error finalizing object:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Public content routes (no auth required)
  
  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Events
  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      const eventsWithImages = await Promise.all(
        events.map(async (event) => {
          const images = await storage.getEventImages(event.id);
          return { ...event, images: images.map(img => img.imageUrl) };
        })
      );
      res.json(eventsWithImages);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/events/past", async (req, res) => {
    try {
      const events = await storage.getPastEvents();
      const eventsWithImages = await Promise.all(
        events.map(async (event) => {
          const images = await storage.getEventImages(event.id);
          return { ...event, images: images.map(img => img.imageUrl) };
        })
      );
      res.json(eventsWithImages);
    } catch (error) {
      console.error("Error fetching past events:", error);
      res.status(500).json({ message: "Failed to fetch past events" });
    }
  });

  // YouTube videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Blog posts (public - only published)
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(req.params.id);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // About content
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      console.error("Error fetching about content:", error);
      res.status(500).json({ message: "Failed to fetch about content" });
    }
  });

  // Admin routes (authentication + admin role required)
  
  // Reviews admin
  app.post("/api/admin/reviews", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review" });
    }
  });

  app.delete("/api/admin/reviews/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteReview(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Events admin
  app.get("/api/admin/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      const eventsWithImages = await Promise.all(
        events.map(async (event) => {
          const images = await storage.getEventImages(event.id);
          return { ...event, images: images.map(img => img.imageUrl) };
        })
      );
      res.json(eventsWithImages);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/admin/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/admin/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/admin/events/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Event images admin
  app.post("/api/admin/event-images", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertEventImageSchema.parse(req.body);
      const image = await storage.createEventImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error creating event image:", error);
      res.status(400).json({ message: "Failed to create event image" });
    }
  });

  app.delete("/api/admin/event-images/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteEventImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event image:", error);
      res.status(500).json({ message: "Failed to delete event image" });
    }
  });

  // YouTube videos admin
  app.post("/api/admin/videos", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertYoutubeVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(400).json({ message: "Failed to create video" });
    }
  });

  app.delete("/api/admin/videos/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteVideo(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Blog posts admin
  app.get("/api/admin/blog/posts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const post = await storage.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // About content admin
  app.put("/api/admin/about", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertAboutContentSchema.parse(req.body);
      const about = await storage.upsertAboutContent(validatedData);
      res.json(about);
    } catch (error) {
      console.error("Error updating about content:", error);
      res.status(500).json({ message: "Failed to update about content" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
