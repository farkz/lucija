import HeroSection from "../HeroSection";
import heroImage from "@assets/generated_images/Opera_singer_portrait_photo_505a6c64.png";

export default function HeroSectionExample() {
  const reviews = [
    {
      quote: "A voice of extraordinary beauty and technical mastery",
      author: "The New York Times"
    },
    {
      quote: "Ercegovac's performance was nothing short of magnificent",
      author: "Opera Magazine"
    },
    {
      quote: "Her portrayal brought tears to the audience's eyes",
      author: "Classical Music Review"
    }
  ];

  return <HeroSection imageSrc={heroImage} reviews={reviews} />;
}
