import {
  users,
  reviews,
  events,
  eventImages,
  youtubeVideos,
  blogPosts,
  aboutContent,
  repertoireItems,
  type User,
  type UpsertUser,
  type Review,
  type InsertReview,
  type Event,
  type InsertEvent,
  type EventImage,
  type InsertEventImage,
  type YoutubeVideo,
  type InsertYoutubeVideo,
  type BlogPost,
  type InsertBlogPost,
  type AboutContent,
  type InsertAboutContent,
  type RepertoireItem,
  type InsertRepertoireItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Review operations
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: string): Promise<void>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
  getPastEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  
  // Event image operations
  getEventImages(eventId: string): Promise<EventImage[]>;
  createEventImage(image: InsertEventImage): Promise<EventImage>;
  deleteEventImage(id: string): Promise<void>;
  
  // YouTube video operations
  getAllVideos(): Promise<YoutubeVideo[]>;
  createVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo>;
  deleteVideo(id: string): Promise<void>;
  
  // Blog post operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  
  // About content operations
  getAboutContent(): Promise<AboutContent | undefined>;
  upsertAboutContent(content: InsertAboutContent): Promise<AboutContent>;
  
  // Repertoire operations
  getAllRepertoireItems(): Promise<RepertoireItem[]>;
  getRepertoireItemsByCategory(category: string): Promise<RepertoireItem[]>;
  createRepertoireItem(item: InsertRepertoireItem): Promise<RepertoireItem>;
  updateRepertoireItem(id: string, item: Partial<InsertRepertoireItem>): Promise<RepertoireItem>;
  deleteRepertoireItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Review operations
  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(asc(reviews.order));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.date));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return db.select().from(events)
      .where(eq(events.isPast, false))
      .orderBy(asc(events.date));
  }

  async getPastEvents(): Promise<Event[]> {
    return db.select().from(events)
      .where(eq(events.isPast, true))
      .orderBy(desc(events.date));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event> {
    const [updated] = await db
      .update(events)
      .set(eventData)
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Event image operations
  async getEventImages(eventId: string): Promise<EventImage[]> {
    return db.select().from(eventImages)
      .where(eq(eventImages.eventId, eventId))
      .orderBy(asc(eventImages.order));
  }

  async createEventImage(image: InsertEventImage): Promise<EventImage> {
    const [newImage] = await db.insert(eventImages).values(image).returning();
    return newImage;
  }

  async deleteEventImage(id: string): Promise<void> {
    await db.delete(eventImages).where(eq(eventImages.id, id));
  }

  // YouTube video operations
  async getAllVideos(): Promise<YoutubeVideo[]> {
    return db.select().from(youtubeVideos).orderBy(asc(youtubeVideos.order));
  }

  async createVideo(video: InsertYoutubeVideo): Promise<YoutubeVideo> {
    const [newVideo] = await db.insert(youtubeVideos).values(video).returning();
    return newVideo;
  }

  async deleteVideo(id: string): Promise<void> {
    await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
  }

  // Blog post operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: string, postData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db
      .update(blogPosts)
      .set({ ...postData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // About content operations
  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent).limit(1);
    return content;
  }

  async upsertAboutContent(contentData: InsertAboutContent): Promise<AboutContent> {
    const [content] = await db
      .insert(aboutContent)
      .values({ id: "default", ...contentData })
      .onConflictDoUpdate({
        target: aboutContent.id,
        set: {
          ...contentData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return content;
  }

  // Repertoire operations
  async getAllRepertoireItems(): Promise<RepertoireItem[]> {
    return db.select().from(repertoireItems).orderBy(asc(repertoireItems.category), asc(repertoireItems.order));
  }

  async getRepertoireItemsByCategory(category: string): Promise<RepertoireItem[]> {
    return db.select().from(repertoireItems)
      .where(eq(repertoireItems.category, category))
      .orderBy(asc(repertoireItems.order));
  }

  async createRepertoireItem(item: InsertRepertoireItem): Promise<RepertoireItem> {
    const [newItem] = await db.insert(repertoireItems).values(item).returning();
    return newItem;
  }

  async updateRepertoireItem(id: string, itemData: Partial<InsertRepertoireItem>): Promise<RepertoireItem> {
    const [item] = await db
      .update(repertoireItems)
      .set(itemData)
      .where(eq(repertoireItems.id, id))
      .returning();
    return item;
  }

  async deleteRepertoireItem(id: string): Promise<void> {
    await db.delete(repertoireItems).where(eq(repertoireItems.id, id));
  }
}

export const storage = new DatabaseStorage();
