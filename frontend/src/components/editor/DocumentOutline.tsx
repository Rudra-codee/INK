import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface DocumentOutlineProps {
    editor: Editor | null;
    isOpen: boolean;
    onToggle: () => void;
}

interface Heading {
    level: number;
    text: string;
    id: string;
    pos: number;
}

export const DocumentOutline = ({ editor, isOpen, onToggle }: DocumentOutlineProps) => {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

    useEffect(() => {
        if (!editor) return;

        const updateHeadings = () => {
            const items: Heading[] = [];
            const transaction = editor.state.tr;

            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                    // Generate a stable ID if not present
                    const id = `heading-${pos}`;
                    items.push({
                        level: node.attrs.level,
                        text: node.textContent,
                        id,
                        pos,
                    });
                }
            });

            setHeadings(items);
        };

        updateHeadings();
        editor.on('update', updateHeadings);

        return () => {
            editor.off('update', updateHeadings);
        };
    }, [editor]);

    const scrollToHeading = (pos: number) => {
        if (!editor) return;

        editor.commands.setTextSelection(pos);
        editor.commands.scrollIntoView();

        // Also scroll the window smoothly
        const domNode = editor.view.nodeDOM(pos) as HTMLElement;
        if (domNode) {
            domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="w-60 h-[calc(100vh-120px)] sticky top-24 overflow-y-auto pr-4 hidden xl:block animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Outline
                </h3>
            </div>

            {headings.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                    No headings yet
                </p>
            ) : (
                <div className="space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.pos)}
                            className={cn(
                                "block w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors truncate",
                                "hover:bg-primary/5 hover:text-primary",
                                activeHeadingId === heading.id ? "text-primary font-medium bg-primary/5" : "text-muted-foreground",
                                heading.level === 1 && "font-semibold",
                                heading.level === 2 && "pl-4",
                                heading.level === 3 && "pl-8",
                                heading.level === 4 && "pl-12"
                            )}
                        >
                            {heading.text || <span className="opacity-50">Untitled</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
