import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {user.name || user.email}
            </h1>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account is secured with JWT & NeonDB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-foreground/80 break-all">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="text-base font-medium">
                  {format(new Date(user.updatedAt), 'PPP p')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Sample actions unlocked for authenticated users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>✅ JWT access token validated via `/api/me`.</p>
              <p>✅ Refresh token stored securely in NeonDB.</p>
              <p>✅ You now have access to this dashboard.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

