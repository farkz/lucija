import { useState } from "react";
import { Share2, Twitter, Facebook, MessageCircle, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Event } from "./EventCard";

interface ShareEventDialogProps {
  event: Event;
}

export default function ShareEventDialog({ event }: ShareEventDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/#upcoming`;
  const shareText = `${event.venue} - ${event.date}\n${event.orchestra}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.venue,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled or failed");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link");
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
  };

  // Check if native share is supported
  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid={`button-share-event-${event.id}`}
          aria-label="Share event"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid={`dialog-share-event-${event.id}`}>
        <DialogHeader>
          <DialogTitle>Share Event</DialogTitle>
          <DialogDescription>
            Share this upcoming performance with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">{event.venue}</p>
            <p className="text-sm text-muted-foreground">{event.date}</p>
            <p className="text-sm text-muted-foreground">{event.orchestra}</p>
          </div>

          <div className="space-y-2">
            {hasNativeShare && (
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className="w-full justify-start gap-2"
                data-testid="button-native-share"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            )}

            <Button
              onClick={() => window.open(shareLinks.twitter, "_blank")}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-share-twitter"
            >
              <Twitter className="w-4 h-4" />
              Share on Twitter
            </Button>

            <Button
              onClick={() => window.open(shareLinks.facebook, "_blank")}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-share-facebook"
            >
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </Button>

            <Button
              onClick={() => window.open(shareLinks.whatsapp, "_blank")}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-share-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full justify-start gap-2"
              data-testid="button-copy-link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Link Copied!
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
