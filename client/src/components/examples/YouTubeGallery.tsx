import YouTubeGallery from "../YouTubeGallery";

export default function YouTubeGalleryExample() {
  const videos = [
    {
      id: "1",
      title: "La Traviata - Sempre libera",
      videoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800"
    },
    {
      id: "2",
      title: "Don Giovanni - Or sai chi l'onore",
      videoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800"
    }
  ];

  return <YouTubeGallery videos={videos} />;
}
