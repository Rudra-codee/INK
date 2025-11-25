import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DocumentGrid } from '@/components/dashboard/DocumentGrid';
import { NewDocumentButton } from '@/components/dashboard/NewDocumentButton';

const HomePage = () => {
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

    // Convert documents to format expected by DocumentGrid (limit to 8 recent)
    const formattedDocuments = documents.slice(0, 8).map(doc => ({
        id: doc.id,
        title: doc.title,
        updatedAt: new Date(doc.updatedAt),
        preview: doc.content.replace(/<[^>]*>/g, '').substring(0, 100),
    }));

    return (
        <div className="min-h-screen bg-background">
            <DashboardTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="md:pl-64 pt-16">
                <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
                    <div className="mb-8 animate-fade-up">
                        <h1 className="text-3xl font-semibold text-foreground mb-2">
                            Welcome back, {user.name || user.email.split('@')[0]}
                        </h1>
                        <p className="text-muted-foreground">
                            Continue where you left off or start something new.
                        </p>
                    </div>

                    <DocumentGrid documents={formattedDocuments} loading={loading} />
                </div>
            </main>

            <NewDocumentButton />
        </div>
    );
};

export default HomePage;
