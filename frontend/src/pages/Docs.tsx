import { Navbar } from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import editorMockup from "@/assets/editor-mockup.png";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-[900px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Header */}
        <div className="space-y-4 mb-16">
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-foreground tracking-tight">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Everything you need to know about Ink — the modern writing platform designed for clarity and focus.
          </p>
        </div>

        {/* Quick Start */}
        <section className="space-y-6 mb-16">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Quick Start
          </h2>
          <Separator className="bg-border/60" />
          <div className="space-y-4">
            <p className="text-base text-foreground/80 leading-relaxed">
              Getting started with Ink is simple. Create an account, and you'll immediately have access to a clean, distraction-free writing environment that syncs in real-time across all your devices.
            </p>
            <div className="bg-card rounded-[12px] p-6 shadow-card space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Step 1: Create Your Account
              </h3>
              <p className="text-base text-muted-foreground">
                Click "Start Writing" in the navigation bar to create your free account. All you need is an email address and a password.
              </p>
              <Button variant="default" asChild>
                <a href="/signup">Create Account</a>
              </Button>
            </div>
            <div className="bg-card rounded-[12px] p-6 shadow-card space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Step 2: Start Writing
              </h3>
              <p className="text-base text-muted-foreground">
                Once logged in, you'll see a blank page — your canvas. Just start typing. Every word is automatically saved and synced.
              </p>
            </div>
            <div className="bg-card rounded-[12px] p-6 shadow-card space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Step 3: Access Anywhere
              </h3>
              <p className="text-base text-muted-foreground">
                Your work is accessible from any device. Log in from your phone, tablet, or another computer — everything stays in sync.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="space-y-6 mb-16">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Platform Overview
          </h2>
          <Separator className="bg-border/60" />
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                What is Ink?
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                Ink is a modern writing platform designed to help you focus on what matters most: your words. Built with a paper-inspired aesthetic and minimal interface, Ink removes distractions and lets you write with clarity.
              </p>
            </div>
            
            <div className="bg-background-secondary rounded-[12px] p-8 space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                Core Features
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-foreground">Real-time Syncing:</strong>
                    <span className="text-muted-foreground"> Your work is saved automatically and synced instantly across all devices.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-foreground">Offline Support:</strong>
                    <span className="text-muted-foreground"> Continue writing even without an internet connection. Changes sync when you're back online.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-foreground">Paper-Inspired Design:</strong>
                    <span className="text-muted-foreground"> A calming, off-white background mimics the feel of writing on premium paper.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-foreground">Minimal Interface:</strong>
                    <span className="text-muted-foreground"> No clutter, no distractions — just you and your words.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <strong className="text-foreground">Collaboration Ready:</strong>
                    <span className="text-muted-foreground"> Share your work and collaborate with others in real-time.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tutorial Section */}
        <section className="space-y-6 mb-16">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Tutorial: Your First Document
          </h2>
          <Separator className="bg-border/60" />
          
          <div className="space-y-8">
            {/* Tutorial Step 1 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                1. The Editor Interface
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                When you first open Ink, you'll see a clean, minimal editor. The interface is designed to fade away, leaving only your text in focus.
              </p>
              <div className="bg-card rounded-[12px] p-6 shadow-card">
                <img 
                  src={editorMockup} 
                  alt="Ink editor interface showing a clean writing environment with paper-tone background"
                  className="w-full rounded-lg shadow-light"
                />
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  The Ink editor — minimal, focused, beautiful.
                </p>
              </div>
            </div>

            {/* Tutorial Step 2 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                2. Writing Your First Words
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                Simply click anywhere in the editor and start typing. There's no need to create a new document or click "save" — everything happens automatically.
              </p>
              <div className="bg-background-secondary rounded-[12px] p-6 space-y-3">
                <p className="text-base text-foreground/80">
                  <strong>Pro tip:</strong> Use keyboard shortcuts to format your text:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li><code className="bg-card px-2 py-1 rounded text-foreground">Ctrl/Cmd + B</code> — Bold text</li>
                  <li><code className="bg-card px-2 py-1 rounded text-foreground">Ctrl/Cmd + I</code> — Italic text</li>
                  <li><code className="bg-card px-2 py-1 rounded text-foreground">Ctrl/Cmd + U</code> — Underline text</li>
                </ul>
              </div>
            </div>

            {/* Tutorial Step 3 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                3. Auto-Save & Sync
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                Every change you make is automatically saved. You'll see a subtle indicator showing that your work is synced. Open Ink on another device, and your document will be there, exactly as you left it.
              </p>
            </div>

            {/* Tutorial Step 4 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">
                4. Organizing Your Work
              </h3>
              <p className="text-base text-foreground/80 leading-relaxed">
                As you create more documents, you can organize them into folders, add tags, and use search to quickly find what you need. Everything is designed to stay out of your way until you need it.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-6 mb-16">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Best Practices
          </h2>
          <Separator className="bg-border/60" />
          <div className="space-y-4">
            <div className="border-l-[3px] border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Write First, Edit Later
              </h3>
              <p className="text-base text-muted-foreground">
                Ink's minimal interface encourages you to get your ideas down first. Don't worry about perfection — just write. You can always refine later.
              </p>
            </div>
            
            <div className="border-l-[3px] border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Use Offline Mode
              </h3>
              <p className="text-base text-muted-foreground">
                Don't let connectivity stop your flow. Ink works beautifully offline, and all changes sync automatically when you're back online.
              </p>
            </div>
            
            <div className="border-l-[3px] border-primary pl-6 py-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Embrace the Simplicity
              </h3>
              <p className="text-base text-muted-foreground">
                Ink doesn't have dozens of formatting options or complex features. This is intentional. The simplicity helps you focus on writing, not fidgeting with tools.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 mb-16">
          <h2 className="text-3xl font-semibold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <Separator className="bg-border/60" />
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Is Ink free to use?
              </h3>
              <p className="text-base text-muted-foreground">
                Yes, Ink offers a free plan with all core features. Premium plans with additional storage and collaboration features are available for power users.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Can I export my documents?
              </h3>
              <p className="text-base text-muted-foreground">
                Absolutely. You can export your work to various formats including plain text, Markdown, PDF, and more.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Is my data secure?
              </h3>
              <p className="text-base text-muted-foreground">
                Your privacy is our priority. All data is encrypted in transit and at rest. We never sell your data or use it for advertising.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Can I collaborate with others?
              </h3>
              <p className="text-base text-muted-foreground">
                Yes! You can invite others to view or edit your documents. Real-time collaboration means you can work together seamlessly.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="bg-background-secondary rounded-[12px] p-12 text-center space-y-6">
          <h2 className="text-4xl font-semibold text-foreground tracking-tight">
            Ready to start writing?
          </h2>
          <p className="text-lg text-muted-foreground max-w-[500px] mx-auto">
            Join thousands of writers who've made Ink their home for clear, focused writing.
          </p>
          <Button variant="default" size="lg" asChild>
            <a href="/signup">Start Writing — It's Free</a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Docs;
