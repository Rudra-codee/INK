import { Card } from '@/components/ui/card';

export const DocumentSkeleton = () => {
    return (
        <Card className="p-5 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-muted" />
                <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="flex-shrink-0 h-5 w-5 bg-muted rounded" />
            </div>
        </Card>
    );
};
