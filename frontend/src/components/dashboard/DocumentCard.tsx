import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
    id: string;
    title: string;
    updatedAt: Date;
    preview?: string;
}

export const DocumentCard = ({ id, title, updatedAt, preview }: DocumentCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/editor/${id}`);
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
                <FileText className="flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
        </Card>
    );
};
