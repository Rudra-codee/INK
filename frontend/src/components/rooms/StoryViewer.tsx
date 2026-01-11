import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';

interface Turn {
    id: string;
    content: string;
    turnOrder: number;
    user: {
        id: string;
        name: string | null;
    };
}

interface StoryViewerProps {
    turns: Turn[];
}

export const StoryViewer = ({ turns }: StoryViewerProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [turns]);

    return (
        <ScrollArea className="flex-1 h-[400px] md:h-[500px] w-full border rounded-md p-4 bg-background shadow-inner">
            <div className="space-y-6 max-w-3xl mx-auto">
                {turns.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        <p>The story hasn't started yet.</p>
                    </div>
                ) : (
                    turns.map((turn) => (
                        <div key={turn.id} className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">{turn.content}</p>
                            <p className="text-xs text-muted-foreground text-right mt-1 border-b pb-2">
                                — {turn.user.name || 'Anonymous'}, Turn #{turn.turnOrder}
                            </p>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    );
};
