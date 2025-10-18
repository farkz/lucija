import { useState } from "react";
import MobileMenu from "../MobileMenu";
import { Button } from "@/components/ui/button";

export default function MobileMenuExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="h-screen">
      <Button onClick={() => setIsOpen(!isOpen)}>Toggle Menu</Button>
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
