import { Link, useLocation } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Home", href: "#home", type: "scroll" as const },
  { label: "About Me", href: "#about", type: "scroll" as const },
  { label: "Calendar/Agenda", href: "#upcoming", type: "scroll" as const },
  { label: "Past Events", href: "#past-events", type: "scroll" as const },
  { label: "Gallery/Videos", href: "#gallery", type: "scroll" as const },
  { label: "Repertoire", href: "/repertoire", type: "page" as const },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [, setLocation] = useLocation();

  if (!isOpen) return null;

  const handleItemClick = (item: typeof menuItems[0]) => {
    if (item.type === "scroll") {
      // Check if we're on the home page
      if (window.location.pathname !== "/") {
        // Navigate to home first, then scroll
        setLocation("/");
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        // Already on home, just scroll
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      // Navigate to a different page
      setLocation(item.href);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
      data-testid="overlay-mobile-menu"
    >
      <nav className="flex flex-col items-center justify-center h-full" onClick={(e) => e.stopPropagation()}>
        {menuItems.map((item, index) => (
          <button
            key={item.href}
            onClick={() => handleItemClick(item)}
            className="font-serif text-2xl py-6 hover-elevate active-elevate-2 px-8 rounded-md"
            style={{ animationDelay: `${index * 50}ms` }}
            data-testid={`link-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
