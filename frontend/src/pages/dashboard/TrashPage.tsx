import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTrash } from '@/hooks/useTrash';
import { useDocumentActions } from '@/hooks/useDocumentActions';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentSkeleton } from '@/components/dashboard/DocumentSkeleton';
import { Trash2, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrashPage = () => {
    const { user, status } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { trashedDocs, loading, refetch } = useTrash();
    const { restoreDocument, permanentDelete } = useDocumentActions();

    useEffect(() => {
        if (status === 'checking') return;
        if (status === 'unauthenticated' || !user) {
            navigate('/login', { replace: true });
        }
    }, [user, status, navigate]);

    const handleRestore = async (id: string) => {
        await restoreDocument(id);
        refetch();
    };

    const handlePermanentDelete = async (id: string) => {
        if (confirm('Are you sure? This action cannot be undone.')) {
            await permanentDelete(id);
            refetch();
        }
    };

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

    return (
        <div className="min-h-screen bg-background">
            <DashboardTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="md:pl-64 pt-16">
                <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-foreground mb-2">
                            Trash
                        </h1>
                        <p className="text-muted-foreground">
                            {trashedDocs.length} {trashedDocs.length === 1 ? 'document' : 'documents'} in trash
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <DocumentSkeleton key={i} />
                            ))}
                        </div>
                    ) : trashedDocs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {trashedDocs.map((doc) => (
                                <Card
                                    key={doc.id}
                                    className="p-5 opacity-75 hover:opacity-100 transition-opacity"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-muted" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-foreground mb-1 truncate">
                                                {doc.title || 'Untitled Document'}
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Deleted {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestore(doc.id)}
                                            className="flex-1 gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Restore
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handlePermanentDelete(doc.id)}
                                            className="flex-1 gap-2"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                                <Trash2 className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Trash is empty
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Deleted documents will appear here and can be restored or permanently deleted.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TrashPage;
