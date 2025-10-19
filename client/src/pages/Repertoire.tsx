import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import SEO from "@/components/SEO";
import { StructuredData, generateRepertoireSchema } from "@/lib/structuredData";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { RepertoireItem } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Utility function to create URL-friendly slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function Repertoire() {
  // Scroll to anchor on page load if hash is present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: repertoireItems = [], isLoading } = useQuery<RepertoireItem[]>({
    queryKey: ["/api/repertoire"],
  });

  const groupedItems = repertoireItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RepertoireItem[]>);

  const operaRoles = groupedItems.opera_role || [];
  const concertRepertoire = groupedItems.concert_work || [];
  const conductors = groupedItems.conductor || [];
  const orchestras = groupedItems.orchestra || [];
  const venues = groupedItems.venue || [];

  return (
    <div className="min-h-screen">
      <SEO
        title="Repertoire - Lucija Ercegovac | Opera Roles & Concert Performances"
        description="Comprehensive repertoire of mezzo-soprano Lucija Ercegovac. Opera roles including Wagner, Mozart, Tchaikovsky, Ravel. Collaborations with Paavo Järvi, Jonathan Nott, Jordi Savall, Philippe Herreweghe."
        keywords="Lucija Ercegovac repertoire, opera roles, Wagner Walküre, Mozart Zauberflöte, mezzo-soprano performances, Paavo Järvi, Jonathan Nott, Jordi Savall, Tonhalle-Orchester Zürich, Opera Bern"
        ogTitle="Repertoire - Lucija Ercegovac Mezzo-Soprano"
        ogDescription="Opera roles and concert performances by Croatian mezzo-soprano Lucija Ercegovac. Collaborations with world-renowned conductors and orchestras."
      />
      
      {/* Structured Data for Repertoire */}
      <StructuredData data={generateRepertoireSchema(repertoireItems)} />
      
      <Header isMenuOpen={isMenuOpen} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl md:text-6xl font-light mb-4 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-repertoire"
            >
              Repertoire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of operatic roles, concert performances, and collaborations
            </p>
          </div>

          {/* Opera Roles */}
          <section id="opera-roles" className="mb-16 scroll-mt-24">
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-opera-roles"
            >
              Operatic Roles
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading repertoire...</div>
            ) : operaRoles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No opera roles available yet.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {operaRoles
                  .sort((a, b) => a.order - b.order)
                  .map((item) => {
                    const anchorId = slugify(item.title);
                    return (
                      <Card 
                        key={item.id} 
                        id={anchorId}
                        data-testid={`card-opera-role-${item.id}`}
                        className="scroll-mt-24"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl font-medium">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        {item.subtitle && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
              </div>
            )}
          </section>

          <Separator className="my-12" />

          {/* Concert & Oratorio Repertoire */}
          <section id="concert-repertoire" className="mb-16 scroll-mt-24">
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-concert-repertoire"
            >
              Concert & Oratorio Repertoire
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading repertoire...</div>
            ) : concertRepertoire.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No concert repertoire available yet.</div>
            ) : (
              <div className="grid gap-4">
                {concertRepertoire
                  .sort((a, b) => a.order - b.order)
                  .map((item) => {
                    const anchorId = slugify(item.title);
                    return (
                      <Card 
                        key={item.id} 
                        id={anchorId}
                        data-testid={`card-concert-${item.id}`}
                        className="scroll-mt-24"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl font-medium">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        {item.subtitle && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
              </div>
            )}
          </section>

          <Separator className="my-12" />

          {/* Collaborations Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Conductors */}
            <section id="conductors" className="scroll-mt-24">
              <h2 
                className="text-3xl font-light mb-6 tracking-wide" 
                style={{ fontFamily: 'var(--font-serif)' }}
                data-testid="heading-conductors"
              >
                Conductors
              </h2>
              <Card>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : conductors.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No conductors listed yet.</div>
                  ) : (
                    <ul className="space-y-2" data-testid="list-conductors">
                      {conductors
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <li key={item.id} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{item.title}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Orchestras & Ensembles */}
            <section id="orchestras" className="scroll-mt-24">
              <h2 
                className="text-3xl font-light mb-6 tracking-wide" 
                style={{ fontFamily: 'var(--font-serif)' }}
                data-testid="heading-orchestras"
              >
                Orchestras & Ensembles
              </h2>
              <Card>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading...</div>
                  ) : orchestras.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">No orchestras listed yet.</div>
                  ) : (
                    <ul className="space-y-2" data-testid="list-orchestras">
                      {orchestras
                        .sort((a, b) => a.order - b.order)
                        .map((item) => (
                          <li key={item.id} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{item.title}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Performance Venues */}
          <section id="venues" className="scroll-mt-24">
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-venues"
            >
              Performance Venues
            </h2>
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading...</div>
                ) : venues.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No venues listed yet.</div>
                ) : (
                  <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2" data-testid="list-venues">
                    {venues
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item.title}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Lucija Ercegovac. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
