import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#about" },
  { label: "Upcoming Events", href: "#upcoming" },
  { label: "Past Events", href: "#past-events" },
  { label: "Archive / YouTube Gallery", href: "#gallery" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  const handleItemClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
            onClick={() => handleItemClick(item.href)}
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
