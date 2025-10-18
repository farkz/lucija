interface AboutSectionProps {
  content: string;
}

export default function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="bg-card px-6 py-12" data-testid="section-about">
      <div className="max-w-prose mx-auto">
        <h2 className="font-serif text-2xl font-light mb-6" data-testid="text-about-heading">
          About Me
        </h2>
        <div className="space-y-4 text-base leading-relaxed" data-testid="text-about-content">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
