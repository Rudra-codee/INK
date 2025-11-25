import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { DocumentSkeleton } from '@/components/dashboard/DocumentSkeleton';
import { NewDocumentButton } from '@/components/dashboard/NewDocumentButton';

const AllDocumentsPage = () => {
    const { user, status } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { documents, loading } = useDocuments();

    useEffect(() => {
        if (status === 'checking') return;
        if (status === 'unauthenticated' || !user) {
            navigate('/login', { replace: true });
        }
    }, [user, status, navigate]);

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

    const formattedDocuments = documents.map(doc => ({
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
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-foreground mb-2">
                            All Documents
                        </h1>
                        <p className="text-muted-foreground">
                            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <DocumentSkeleton key={i} />
                            ))}
                        </div>
                    ) : formattedDocuments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {formattedDocuments.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    id={doc.id}
                                    title={doc.title}
                                    updatedAt={doc.updatedAt}
                                    preview={doc.preview}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No documents yet</p>
                        </div>
                    )}
                </div>
            </main>

            <NewDocumentButton />
        </div>
    );
};

export default AllDocumentsPage;
