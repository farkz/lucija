import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import SEO from "@/components/SEO";
import { StructuredData, generateRepertoireSchema } from "@/lib/structuredData";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Repertoire() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const operaRoles = [
    {
      role: "Pauline",
      opera: "La vie parisienne",
      composer: "Offenbach",
      venue: "Bühnen Bern",
      season: "2024/25"
    },
    {
      role: "Rossweisse",
      opera: "Die Walküre",
      composer: "Wagner",
      venue: "Opera Bern",
      season: "2022/23"
    },
    {
      role: "Zweite Dame",
      opera: "Die Zauberflöte",
      composer: "Mozart",
      venue: "Opera Bern",
      season: "2022/23"
    },
    {
      role: "Laura",
      opera: "Iolanta",
      composer: "Tchaikovsky",
      venue: "Opera Bern",
      season: "2022/23"
    },
    {
      role: "La chatte / l'écureuil / un pâtre",
      opera: "L'Enfant et les sortilèges",
      composer: "Ravel",
      venue: "Opera Bern",
      season: "2022/23"
    },
    {
      role: "Zweite Priesterin / Femme Grecque",
      opera: "Iphigénie en Tauride",
      composer: "Gluck",
      venue: "Opera Bern",
      season: "2022/23"
    },
    {
      role: "Third Boy",
      opera: "Die Zauberflöte",
      composer: "Mozart",
      venue: "Croatian National Theatre",
      season: "Earlier career"
    },
    {
      role: "Madame de la Haltière",
      opera: "Cendrillon",
      composer: "Massenet",
      venue: "Music Academy Zagreb",
      season: "Earlier career"
    }
  ];

  const concertRepertoire = [
    {
      work: "Symphony No. 9",
      composer: "Beethoven",
      conductor: "Jonathan Nott",
      ensemble: "Orchestre de la Suisse Romande",
      venue: "Victoria Hall Geneva"
    },
    {
      work: "Carmina Burana",
      composer: "Orff",
      conductor: "Paavo Järvi",
      ensemble: "Tonhalle-Orchester Zürich",
      venue: "Tonhalle Zürich"
    },
    {
      work: "Ein deutsches Requiem",
      composer: "Brahms",
      conductor: "Florian Helgath",
      ensemble: "Orchestra La Scintilla",
      venue: "Tonhalle Zürich"
    },
    {
      work: "A Midsummer Night's Dream",
      composer: "Mendelssohn",
      conductor: "Jordi Savall",
      ensemble: "La Capella Nacional de Catalunya, Le Concert des Nations",
      venue: "European Tour"
    },
    {
      work: "Les noces",
      composer: "Stravinsky",
      conductor: "Sebastian Schwab",
      ensemble: "Zürcher Sing Akademie",
      venue: "Opernhaus Zürich"
    },
    {
      work: "Isis",
      composer: "George Enescu",
      conductor: "Peter Ruzicka",
      ensemble: "Tonhalle-Orchester Zürich",
      venue: "Tonhalle Zürich"
    },
    {
      work: "Rossini Gala (Tancredi, Il barbiere di Siviglia)",
      composer: "Rossini",
      conductor: "Jakob Lehman",
      ensemble: "La Banda Storica",
      venue: "Various venues"
    },
    {
      work: "Various concert repertoire",
      composer: "Bach, Telemann, Charpentier, Mahler, Debussy, Berio",
      conductor: "Philippe Herreweghe, Peter Kooij",
      ensemble: "Collegium Vocale Gent",
      venue: "Various venues"
    }
  ];

  const conductors = [
    "Paavo Järvi",
    "Jonathan Nott",
    "Jordi Savall",
    "Philippe Herreweghe",
    "Florian Helgath",
    "Peter Ruzicka",
    "Sebastian Schwab",
    "Jakob Lehman",
    "Peter Kooij"
  ];

  const orchestras = [
    "Tonhalle-Orchester Zürich",
    "Orchestre de la Suisse Romande",
    "Le Concert des Nations",
    "La Capella Nacional de Catalunya",
    "Collegium Vocale Gent",
    "Orchestra La Scintilla",
    "Zürcher Sing Akademie",
    "La Banda Storica",
    "Zagreb Soloists Chamber Orchestra",
    "Croatian Radio Choir"
  ];

  const venues = [
    "Opera Bern (Bühnen Bern)",
    "Tonhalle Zürich",
    "Opernhaus Zürich",
    "Victoria Hall Geneva",
    "Croatian National Theatre Zagreb",
    "Music Academy Zagreb"
  ];

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
      <StructuredData data={generateRepertoireSchema()} />
      
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
          <section className="mb-16">
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-opera-roles"
            >
              Operatic Roles
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {operaRoles.map((role, index) => (
                <Card key={index} data-testid={`card-opera-role-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-medium">
                      {role.role}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Opera:</span>{" "}
                        <span className="font-medium">{role.opera}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Composer:</span>{" "}
                        {role.composer}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Venue:</span>{" "}
                        {role.venue}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Season:</span>{" "}
                        {role.season}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Concert & Oratorio Repertoire */}
          <section className="mb-16">
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-concert-repertoire"
            >
              Concert & Oratorio Repertoire
            </h2>
            <div className="grid gap-4">
              {concertRepertoire.map((concert, index) => (
                <Card key={index} data-testid={`card-concert-${index}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-medium">
                      {concert.work}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p>
                          <span className="text-muted-foreground">Composer:</span>{" "}
                          {concert.composer}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Conductor:</span>{" "}
                          {concert.conductor}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p>
                          <span className="text-muted-foreground">Ensemble:</span>{" "}
                          {concert.ensemble}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Venue:</span>{" "}
                          {concert.venue}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Collaborations Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Conductors */}
            <section>
              <h2 
                className="text-3xl font-light mb-6 tracking-wide" 
                style={{ fontFamily: 'var(--font-serif)' }}
                data-testid="heading-conductors"
              >
                Conductors
              </h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2" data-testid="list-conductors">
                    {conductors.map((conductor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{conductor}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Orchestras & Ensembles */}
            <section>
              <h2 
                className="text-3xl font-light mb-6 tracking-wide" 
                style={{ fontFamily: 'var(--font-serif)' }}
                data-testid="heading-orchestras"
              >
                Orchestras & Ensembles
              </h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2" data-testid="list-orchestras">
                    {orchestras.map((orchestra, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{orchestra}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Performance Venues */}
          <section>
            <h2 
              className="text-3xl font-light mb-6 tracking-wide" 
              style={{ fontFamily: 'var(--font-serif)' }}
              data-testid="heading-venues"
            >
              Performance Venues
            </h2>
            <Card>
              <CardContent className="p-6">
                <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2" data-testid="list-venues">
                  {venues.map((venue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{venue}</span>
                    </li>
                  ))}
                </ul>
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
