import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Info, Palette, Shield, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const { user, status } = useAuth();
  const { theme, setTheme, themeOptions } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab === 'appearance' || tab === 'about') return tab;
    return 'account';
  }, [searchParams]);

  useEffect(() => {
    if (status === 'checking') return;
    if (status === 'unauthenticated' || !user) {
      navigate('/login', { replace: true });
    }
  }, [status, user, navigate]);

  if (status === 'checking' || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || user.email[0].toUpperCase();

  const createdDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(user.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardTopNav onMenuClick={() => setSidebarOpen((open) => !open)} />
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:pl-64 pt-16">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-10">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your Ink account, personalize your workspace, and learn quick platform basics.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(tab) => setSearchParams({ tab })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 md:w-fit">
              <TabsTrigger value="account" className="gap-2">
                <UserCircle2 className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <Info className="h-4 w-4" />
                About Ink
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account details</CardTitle>
                  <CardDescription>Your profile and sign-in information for Ink.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border border-border">
                      <AvatarImage src={user.avatar || undefined} alt={user.name || user.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{user.name || 'Ink user'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary">{user.googleId ? 'Google account' : 'Email account'}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-background-secondary p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Account ID</p>
                      <p className="text-sm font-medium break-all">{user.id}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Member since</p>
                      <p className="text-sm font-medium">{createdDate}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Last profile sync</p>
                      <p className="text-sm font-medium">{updatedDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme preferences</CardTitle>
                  <CardDescription>Choose a visual style that feels best while writing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {themeOptions.map((themeOption) => {
                      const isActive = theme === themeOption.id;
                      return (
                        <button
                          key={themeOption.id}
                          type="button"
                          onClick={() => setTheme(themeOption.id)}
                          className={`text-left border rounded-lg p-4 transition-colors ${
                            isActive
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-foreground">{themeOption.name}</p>
                            {isActive && <Check className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{themeOption.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ink basics</CardTitle>
                  <CardDescription>Quick documentation to help you get productive faster.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="text-base font-semibold mb-2">What is Ink?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ink is a focused writing workspace for documents and collaborative story rooms. You can draft
                      notes, essays, journals, and meeting summaries while keeping everything organized in one place.
                    </p>
                  </section>
                  <Separator />
                  <section className="space-y-3">
                    <h3 className="text-base font-semibold">Getting started</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Use <span className="text-foreground font-medium">New Document</span> to create a blank page quickly.</li>
                      <li>Open <span className="text-foreground font-medium">All Documents</span> to browse and continue recent work.</li>
                      <li>Pin important content in <span className="text-foreground font-medium">Favorites</span>.</li>
                      <li>Recover deleted drafts anytime from <span className="text-foreground font-medium">Trash</span>.</li>
                    </ul>
                  </section>
                  <Separator />
                  <section className="rounded-lg border border-border bg-background-secondary p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Your account security</p>
                        <p className="text-sm text-muted-foreground">
                          Ink keeps your login session in this browser. Use the profile menu to log out if you are on a
                          shared device.
                        </p>
                      </div>
                    </div>
                  </section>
                  <div className="pt-2">
                    <Button variant="secondary" onClick={() => navigate('/docs')}>
                      Open full documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
