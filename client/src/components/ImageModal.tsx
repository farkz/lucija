import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  useEffect(() => {
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [imageUrl]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="modal-image"
    >
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
        onClick={onClose}
        data-testid="button-close-modal"
      >
        <X className="w-6 h-6" />
      </Button>
      
      <img
        src={imageUrl}
        alt="Full screen view"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
        data-testid="img-modal-content"
      />
    </div>
  );
}
