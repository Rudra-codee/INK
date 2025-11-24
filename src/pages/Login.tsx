import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt", { email, password });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-foreground tracking-tight">
            Ink
          </h1>
        </div>

        {/* Card */}
        <div className="bg-card rounded-[12px] shadow-card p-8 sm:p-10 space-y-6">
          {/* Heading */}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              Log in to Ink
            </h2>
            <p className="text-sm text-muted-foreground">
              Continue your writing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg border-border focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-lg border-border focus-visible:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium transition-all duration-150 hover:-translate-y-0.5"
            >
              Log in
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-hover font-medium transition-colors duration-150"
              >
                Sign up →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
