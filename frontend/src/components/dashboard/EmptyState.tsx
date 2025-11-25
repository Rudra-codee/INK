import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyState = () => {
    const navigate = useNavigate();

    const handleCreateDocument = () => {
        const tempId = `new-${Date.now()}`;
        navigate(`/editor/${tempId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-up">
            {/* Paper icon */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-primary" />
            </div>

            {/* Message */}
            <h3 className="text-xl font-semibold text-foreground mb-2">
                No documents yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md">
                Start writing your first one and let your ideas flow onto the page.
            </p>

            {/* Create button */}
            <Button
                onClick={handleCreateDocument}
                size="lg"
                className="h-12 px-8 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
                Create Document
            </Button>
        </div>
    );
};
