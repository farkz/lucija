import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export default function SEO({
  title = "Lucija Ercegovac - Mezzo-Soprano | Opera & Concert Performances",
  description = "Croatian mezzo-soprano Lucija Ercegovac performs opera and concert repertoire across Europe. Collaborations with Paavo Järvi, Jonathan Nott, Jordi Savall. Opera Bern, Tonhalle Zürich.",
  keywords = "Lucija Ercegovac, mezzo-soprano, opera singer, Croatian opera, Opera Bern, Tonhalle Zürich, Wagner, Mozart, Verdi, Puccini, classical music Switzerland, opera performances",
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogUrl,
  twitterCard = "summary_large_image"
}: SEOProps) {
  const baseUrl = import.meta.env.PROD ? "https://lucijaercegovac.com" : window.location.origin;
  const fullOgUrl = ogUrl || baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:image" content={fullOgImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
}
