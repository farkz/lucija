import { useState } from "react";
import ImageModal from "../ImageModal";
import { Button } from "@/components/ui/button";

export default function ImageModalExample() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  return (
    <div className="p-4">
      <Button onClick={() => setImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800")}>
        Open Image Modal
      </Button>
      <ImageModal imageUrl={imageUrl} onClose={() => setImageUrl(null)} />
    </div>
  );
}
