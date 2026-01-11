import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';

interface TurnEditorProps {
    onSubmit: (content: string) => Promise<void>;
    wordLimit: number;
    isSubmitting?: boolean;
}

export const TurnEditor = ({ onSubmit, wordLimit, isSubmitting = false }: TurnEditorProps) => {
    const [content, setContent] = useState('');
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const count = content.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(count);
    }, [content]);

    const handleSubmit = async () => {
        if (!content.trim() || wordCount > wordLimit) return;
        await onSubmit(content);
        setContent('');
    };

    const isOverLimit = wordCount > wordLimit;

    return (
        <div className="space-y-4 p-4 border-t border-border bg-card">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Your Turn</h3>
                <span className={`text-xs ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {wordCount} / {wordLimit} words
                </span>
            </div>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the next paragraph..."
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
            />
            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isOverLimit || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Turn'}
                </Button>
            </div>
        </div>
    );
};
