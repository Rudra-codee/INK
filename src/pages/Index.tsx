import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { UseCaseBlock } from "@/components/UseCaseBlock";
import { Zap, FileText, WifiOff, Users, CheckCircle2, ArrowRight } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import editorMockup from "@/assets/editor-mockup.png";

const Index = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="animate-fade-up space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground">
                  Ink
                </h1>
                <p className="text-2xl sm:text-3xl font-medium text-foreground">
                  Write. Collaborate. Flow.
                </p>
              </div>
              
              <p className="text-lg leading-relaxed text-muted-foreground max-w-md">
                A real-time writing experience built for clarity, focus, and effortless teamwork.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button variant="hero" size="lg" className="group">
                  Start Writing
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="secondary" size="lg">
                  View Demo
                </Button>
              </div>
            </div>
            
            {/* Right Column - Illustration */}
            <div className="relative animate-float">
              <img 
                src={heroIllustration} 
                alt="Blue ink transforming into elegant text" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-background px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Live Sync"
              description="Edits appear instantly across every device."
            />
            <FeatureCard
              icon={FileText}
              title="Clean Writing"
              description="A distraction-free editor with a paper-like layout."
            />
            <FeatureCard
              icon={WifiOff}
              title="Offline First"
              description="Work offline; changes sync automatically when you reconnect."
            />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="bg-secondary px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px] text-center">
          <div className="space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
              A workspace that feels like writing on paper.
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple margins, natural spacing, ink-inspired details.
            </p>
          </div>
          
          <div className="relative mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-xl bg-card shadow-card">
              <img 
                src={editorMockup} 
                alt="Clean writing editor interface with paper-like background" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Ink Section */}
      <section className="bg-background px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Why Ink?
              </h2>
              <p className="text-lg leading-relaxed text-foreground/90">
                Ink is built for people who truly love writing. No clutter. No noise. Just a beautiful page and real-time collaboration that stays out of your way.
              </p>
            </div>
            
            {/* Right Column - Bullets */}
            <div className="space-y-4">
              {[
                "Real-time collaboration",
                "Offline editing",
                "Crisp paper UI",
                "Ink-driven aesthetics",
                "Fast, reliable sync"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-base text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Preview */}
      <section className="bg-secondary px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                Collaboration that feels natural.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                See where teammates type, comment, and think — live.
              </p>
              
              {/* Avatar Row */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-primary font-medium transition-transform hover:scale-110 hover:z-10"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">and your team</span>
              </div>
            </div>
            
            {/* Right Column - Visual */}
            <div className="bg-card rounded-lg p-8 shadow-card">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>3 people editing</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Alex", color: "bg-blue-500" },
                    { name: "Jordan", color: "bg-green-500" },
                    { name: "Sam", color: "bg-purple-500" }
                  ].map((user, i) => (
                    <div key={i} className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className={`h-2 w-2 rounded-full ${user.color} animate-pulse`} />
                      <span className="text-sm text-foreground">{user.name} is typing...</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-background px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-12 text-3xl sm:text-4xl font-semibold text-foreground text-center">
            Who uses Ink?
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <UseCaseBlock
              title="Writers"
              description="Craft stories and articles with a distraction-free, paper-like interface."
            />
            <UseCaseBlock
              title="Students"
              description="Collaborate on essays and research with real-time sync across devices."
            />
            <UseCaseBlock
              title="Teams"
              description="Work together on documents with natural, live collaboration."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-secondary px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1200px] text-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground">
              Start writing with Ink.
            </h2>
            <p className="text-lg text-muted-foreground">
              Crafted for clarity and flow.
            </p>
            <div className="pt-4">
              <Button variant="hero" size="lg" className="group">
                Start Writing
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-6 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="font-serif text-2xl font-semibold text-foreground">
              Ink
            </div>
            <nav className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">
                GitHub
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Docs
              </a>
              <a href="#" className="transition-colors hover:text-foreground">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
