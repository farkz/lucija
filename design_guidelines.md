# Design Guidelines: Lucija Ercegovac - Opera Singer Portfolio

## Design Approach
**Reference-Based Approach** - Drawing inspiration from premium portfolio sites and cultural institution aesthetics (Apple's minimalism, Metropolitan Opera's sophistication, high-end photography portfolios). This creates an elegant, timeless presentation befitting an opera singer's professional presence.

## Core Design Principles
- **Sophisticated Minimalism**: Clean, uncluttered layouts that let Lucija's artistry take center stage
- **Image-First Experience**: Full-screen, high-quality photography drives emotional connection
- **Effortless Navigation**: Smooth scroll-based transitions between sections with accessible hamburger menu
- **Timeless Elegance**: Design should feel current yet endure beyond trends

## Color Palette

**Dark Mode** (Primary):
- Background: 12 8% 8% (Deep charcoal with warmth)
- Surface: 12 6% 12% (Elevated surfaces)
- Text Primary: 45 15% 96% (Warm white)
- Text Secondary: 45 8% 75% (Muted warm gray)
- Accent: 45 65% 88% (Soft gold for emphasis - sparingly)
- Borders: 12 8% 20% (Subtle dividers)

**Light Mode** (Admin Panel):
- Background: 45 25% 98%
- Surface: 0 0% 100%
- Text Primary: 12 15% 15%
- Text Secondary: 12 8% 40%
- Accent: 45 85% 45%

## Typography

**Font Families** (via Google Fonts):
- Display: 'Cormorant Garamond' - Elegant serif for name and headlines
- Body: 'Inter' - Clean sans-serif for readability

**Type Scale**:
- Hero Name: text-4xl font-light tracking-wide (Cormorant)
- Section Headings: text-2xl font-light (Cormorant)
- Event Titles: text-lg font-medium (Inter)
- Body Text: text-base font-normal (Inter)
- Review Citations: text-sm italic (Inter)

## Layout System

**Spacing Units**: Use Tailwind units of 4, 6, 8, 12, 16, 20 (p-4, m-8, gap-6, etc.)

**Mobile-First Containers**:
- Full-bleed images: w-full h-screen
- Content sections: px-6 py-12
- Event cards: px-4 py-8
- Max width for text: max-w-prose

**Grid System**:
- Event photos: grid grid-cols-2 gap-2 (2-column for event thumbnails)
- Past events list: Single column stacked cards

## Component Library

### Header (Fixed)
- Fixed top, backdrop-blur-md with subtle background
- Left: "LUCIJA ERCEGOVAC" (Cormorant, tracking-widest, text-lg)
- Right: Hamburger icon (3 horizontal lines, smooth animation to X)
- Height: h-16, subtle bottom border

### Hamburger Menu (Overlay)
- Full-screen slide-in from right
- Dark backdrop (backdrop-blur-xl bg-black/80)
- Menu items: Large, Cormorant font, generous spacing (py-6)
- Smooth fade-in animation for menu items
- Close on item selection or outside tap

### Hero Section
- Full viewport height (h-screen)
- Single professional portrait of Lucija (full-bleed)
- Subtle gradient overlay on bottom 40% for review slider visibility
- Image should be portrait-oriented, sophisticated staging

### Review Slider (Bottom of Hero)
- Positioned absolute bottom (bottom-0)
- Semi-transparent backdrop (backdrop-blur-lg bg-black/30)
- Horizontal swipe slider with snap points
- Each slide: Quote text (text-lg italic) + Attribution (text-sm, lighter opacity)
- Pagination dots below (small, subtle)
- Padding: px-6 py-8

### About Me Section
- Clean single-column layout
- Elegant paragraph spacing (space-y-4)
- Optional subtle divider line above (border-t)
- Background slightly different from main (bg-surface)

### Event Cards
- White/elevated surface cards (rounded-xl)
- Content: Date (small caps, muted) → Venue (bold) → Orchestra → 2x2 photo grid
- Photos: aspect-square, rounded, clickable with subtle hover scale
- Card spacing: space-y-6 between events

### Full-Screen Image Modal
- Black backdrop (bg-black)
- Image: Centered, max dimensions, maintain aspect ratio
- Close button: Top-right, large X icon
- Swipe down to close gesture
- Pinch-to-zoom capability

### Admin Panel
- Light mode interface for contrast
- Clean form layouts with labeled inputs
- Simple table views for event management
- WYSIWYG editor for blog posts
- Image upload with preview
- "Add Event" button prominent (accent color)

## Images

**Hero Image**: Professional portrait of Lucija in performance attire or formal dress, sophisticated staging with concert hall or dramatic backdrop. Should be vertical/portrait orientation to fill mobile screen beautifully.

**Event Images**: 4 high-quality photos per event - mix of performance shots, venue exteriors, orchestra, and audience perspectives. Each image should tell part of the event story.

**About Section**: Optional small portrait or candid rehearsal photo (circular crop, positioned elegantly within text)

## Animations

**Minimal & Purposeful**:
- Hamburger menu: Smooth 300ms slide-in transition
- Image modal: Fade-in 200ms
- Scroll reveals: Subtle fade-up on about/event sections (intersection observer)
- Review slider: Smooth horizontal snap scrolling (native CSS scroll-snap)
- Event card images: Gentle scale on tap (scale-105)

**No Animations**: Avoid parallax, excessive fades, or distracting motion

## Interactions

- Pull-to-refresh on homepage
- Smooth scroll anchoring to sections from menu
- Haptic feedback on menu item taps (if supported)
- Long-press on images for download/share options
- Double-tap image zoom in modal

## Content Hierarchy

1. **Hero** (100vh) - Immediate visual impact with Lucija's portrait
2. **About** (natural height) - 2-3 paragraphs, education highlights
3. **Upcoming Events** (dynamic) - Chronological list with photos
4. **Past Events** (dynamic) - Reverse chronological archive
5. **YouTube Gallery** (grid) - Embedded videos or thumbnails linking to YouTube

This design creates an elegant, mobile-optimized experience that showcases Lucija's artistry through sophisticated visual presentation and intuitive navigation.