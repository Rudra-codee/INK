import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { useState } from 'react';

interface DashboardTopNavProps {
    onMenuClick?: () => void;
}

export const DashboardTopNav = ({ onMenuClick }: DashboardTopNavProps) => {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                {/* Left: Logo and Dashboard text */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <h1 className="font-serif text-2xl font-bold text-foreground">
                            Ink
                        </h1>
                        <span className="hidden sm:block text-sm text-muted-foreground">
                            Dashboard
                        </span>
                    </div>
                </div>

                {/* Center: Search bar */}
                <div className="flex-1 max-w-2xl mx-4 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search documents..."
                            className={`pl-10 transition-all duration-200 ${searchFocused ? 'ring-2 ring-primary/20 scale-[1.02]' : ''
                                }`}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Right: User menu */}
                <UserMenu />
            </div>
        </nav>
    );
};
