import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Repertoire from "@/pages/Repertoire";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminVideos from "@/pages/admin/AdminVideos";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminAbout from "@/pages/admin/AdminAbout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/repertoire" component={Repertoire} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/reviews" component={AdminReviews} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/videos" component={AdminVideos} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/about" component={AdminAbout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
