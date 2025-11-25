import { formatDistanceToNow } from 'date-fns';
import { Loader2, Check } from 'lucide-react';

interface SaveIndicatorProps {
    saving: boolean;
    lastSaved: Date | null;
}

export const SaveIndicator = ({ saving, lastSaved }: SaveIndicatorProps) => {
    if (saving) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
            </div>
        );
    }

    if (lastSaved) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
            </div>
        );
    }

    return null;
};
