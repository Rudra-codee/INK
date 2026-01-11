import { Home, FileText, Users, Star, Trash2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { docsApi } from '@/lib/api';
import { useState } from 'react';

interface SidebarNavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: string;
    className?: string;
    activeClassName?: string;
}

interface DashboardSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const DashboardSidebar = ({ isOpen = true, onClose }: DashboardSidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessToken } = useAuth();
    const [creating, setCreating] = useState(false);

    const navItems: SidebarNavItem[] = [
        { label: 'Home', icon: <Home className="h-4 w-4" />, path: '/dashboard' },
        { label: 'All Documents', icon: <FileText className="h-4 w-4" />, path: '/dashboard/all-documents' },
        { label: 'Shared With Me', icon: <Users className="h-4 w-4" />, path: '/dashboard/shared' },
        {
            label: 'Story Rooms',
            icon: <Sparkles className="h-4 w-4" />,
            path: '/rooms',
            badge: 'NEW',
            className: 'text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 hover:text-blue-700 dark:text-blue-400 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 dark:hover:text-blue-300',
            activeClassName: 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900/40 dark:text-blue-300'
        },
        { label: 'Favorites', icon: <Star className="h-4 w-4" />, path: '/dashboard/favorites' },
        { label: 'Trash', icon: <Trash2 className="h-4 w-4" />, path: '/dashboard/trash' },
    ];

    const handleNavClick = (path: string) => {
        navigate(path);
        onClose?.();
    };

    const handleNewDocument = async () => {
        if (!accessToken) return;

        try {
            setCreating(true);
            const doc = await docsApi.create({ title: 'Untitled Document' }, accessToken);
            navigate(`/editor/${doc.id}`);
            onClose?.();
        } catch (error) {
            console.error('Failed to create document:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-16 bottom-0 z-40 w-64 bg-background-secondary border-r border-border transition-transform duration-200 md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* New Document Button */}
                    <Button
                        onClick={handleNewDocument}
                        disabled={creating}
                        className="w-full mb-6 h-11 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        {creating ? 'Creating...' : 'New Document'}
                    </Button>

                    {/* Navigation Items */}
                    <nav className="space-y-1 flex-1">
                        {navItems.map((item) => {
                            const isActive = item.path === '/rooms'
                                ? location.pathname.startsWith('/rooms')
                                : location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavClick(item.path)}
                                    className={cn(
                                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                        item.className,
                                        isActive
                                            ? (item.activeClassName || 'bg-primary text-primary-foreground shadow-sm')
                                            : (item.className || 'text-foreground hover:bg-card hover:text-primary')
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/50">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};
