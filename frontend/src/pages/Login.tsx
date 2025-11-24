import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath =
    (location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to login";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
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
              disabled={submitting}
              className="w-full h-11 text-base font-medium transition-all duration-150 hover:-translate-y-0.5"
            >
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="relative">
            <div className="flex items-center gap-4 my-2">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <GoogleSignInButton />
          </div>

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
