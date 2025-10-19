import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Repertoire from "@/pages/Repertoire";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";

// Lazy load admin pages to reduce initial bundle size
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews"));
const AdminEvents = lazy(() => import("@/pages/admin/AdminEvents"));
const AdminVideos = lazy(() => import("@/pages/admin/AdminVideos"));
const AdminBlog = lazy(() => import("@/pages/admin/AdminBlog"));
const AdminAbout = lazy(() => import("@/pages/admin/AdminAbout"));
const AdminRepertoire = lazy(() => import("@/pages/admin/AdminRepertoire"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/repertoire" component={Repertoire} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/admin">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminDashboard />
        </Suspense>
      </Route>
      <Route path="/admin/reviews">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminReviews />
        </Suspense>
      </Route>
      <Route path="/admin/events">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminEvents />
        </Suspense>
      </Route>
      <Route path="/admin/videos">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminVideos />
        </Suspense>
      </Route>
      <Route path="/admin/blog">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminBlog />
        </Suspense>
      </Route>
      <Route path="/admin/about">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminAbout />
        </Suspense>
      </Route>
      <Route path="/admin/repertoire">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AdminRepertoire />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
