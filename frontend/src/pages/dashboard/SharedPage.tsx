import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Users } from 'lucide-react';

const SharedPage = () => {
    const { user, status } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    return (
        <div className="min-h-screen bg-background">
            <DashboardTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="md:pl-64 pt-16">
                <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-foreground mb-2">
                            Shared With Me
                        </h1>
                        <p className="text-muted-foreground">
                            Documents shared by others
                        </p>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <Users className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            No shared documents yet
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                            When someone shares a document with you, it will appear here.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SharedPage;
