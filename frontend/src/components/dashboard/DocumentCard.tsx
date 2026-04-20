import { FileText, Star, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useDocumentActions } from '@/hooks/useDocumentActions';
import { useState } from 'react';
import type { MouseEvent } from 'react';

interface DocumentCardProps {
    id: string;
    title: string;
    updatedAt: Date;
    preview?: string;
    isFavorite?: boolean;
    onActionComplete?: () => void;
}

export const DocumentCard = ({ id, title, updatedAt, preview, isFavorite = false, onActionComplete }: DocumentCardProps) => {
    const navigate = useNavigate();
    const { toggleFavorite, moveToTrash } = useDocumentActions();
    const [pendingAction, setPendingAction] = useState<'favorite' | 'trash' | null>(null);

    const handleClick = () => {
        navigate(`/editor/${id}`);
    };

    const handleFavorite = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        try {
            setPendingAction('favorite');
            await toggleFavorite(id, isFavorite);
            await onActionComplete?.();
        } catch (error) {
            console.error('Failed to update favorite:', error);
        } finally {
            setPendingAction(null);
        }
    };

    const handleTrash = async (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!window.confirm('Move this document to trash?')) return;

        try {
            setPendingAction('trash');
            await moveToTrash(id);
            await onActionComplete?.();
        } catch (error) {
            console.error('Failed to move document to trash:', error);
        } finally {
            setPendingAction(null);
        }
    };

    return (
        <Card
            onClick={handleClick}
            className="group cursor-pointer p-5 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] hover:border-primary/20"
        >
            <div className="flex items-start gap-3">
                {/* Blue ink accent dot */}
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />

                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="font-medium text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                        {title || 'Untitled Document'}
                    </h3>

                    {/* Last edited */}
                    <p className="text-xs text-muted-foreground">
                        Edited {formatDistanceToNow(updatedAt, { addSuffix: true })}
                    </p>

                    {/* Preview text if available */}
                    {preview && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {preview}
                        </p>
                    )}
                </div>

                {/* Document icon */}
                <div className="flex flex-col items-end gap-2">
                    <FileText className="flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="flex items-center gap-1 rounded-md border border-border/70 bg-background-secondary/70 p-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleFavorite}
                            disabled={pendingAction !== null}
                            className="h-7 w-7 rounded-md hover:bg-background"
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Star
                                className={`h-3.5 w-3.5 transition-colors ${isFavorite
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleTrash}
                            disabled={pendingAction !== null}
                            className="h-7 w-7 rounded-md hover:bg-background"
                            title="Move to trash"
                        >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
