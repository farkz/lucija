import { useState } from "react";
import Header from "../Header";

export default function HeaderExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <Header 
      isMenuOpen={isMenuOpen} 
      onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
    />
  );
}
