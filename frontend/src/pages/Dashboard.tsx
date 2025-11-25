import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DocumentGrid } from '@/components/dashboard/DocumentGrid';
import { NewDocumentButton } from '@/components/dashboard/NewDocumentButton';

const Dashboard = () => {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { documents, loading } = useDocuments();

  // Authentication gate
  useEffect(() => {
    if (status === 'checking') return;

    if (status === 'unauthenticated' || !user) {
      navigate('/login', { replace: true });
      return;
    }
  }, [user, status, navigate]);

  // Show nothing while checking auth or redirecting
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

  // Convert documents to format expected by DocumentGrid
  const formattedDocuments = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    updatedAt: new Date(doc.updatedAt),
    preview: doc.content.replace(/<[^>]*>/g, '').substring(0, 100), // Strip HTML and get preview
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <DashboardTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="md:pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Welcome back, {user.name || user.email.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">
              Continue where you left off or start something new.
            </p>
          </div>

          {/* Document Grid */}
          <DocumentGrid documents={formattedDocuments} loading={loading} />
        </div>
      </main>

      {/* Floating New Document Button */}
      <NewDocumentButton />
    </div>
  );
};

export default Dashboard;
