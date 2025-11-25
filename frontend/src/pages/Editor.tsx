import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDocument } from '@/hooks/useDocument';
import { useAutosave } from '@/hooks/useAutosave';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { DocumentOutline } from '@/components/editor/DocumentOutline';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';

const EditorPage = () => {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const { user, status } = useAuth();
    const { document, loading, error, saveDocument } = useDocument(docId!);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editor, setEditor] = useState<Editor | null>(null);
    const [showOutline, setShowOutline] = useState(false);

    // Authentication gate
    useEffect(() => {
        if (status === 'checking') return;

        if (status === 'unauthenticated' || !user) {
            navigate('/login', { replace: true });
        }
    }, [user, status, navigate]);

    // Initialize editor content when document loads
    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setContent(document.content);
        }
    }, [document]);

    // Update editor content when document loads (if editor is ready)
    useEffect(() => {
        if (editor && document && !editor.getText()) {
            editor.commands.setContent(document.content);
        }
    }, [editor, document]);

    // Autosave setup
    const { saving, lastSaved, manualSave } = useAutosave(title, content, {
        onSave: async (t, c) => {
            await saveDocument(t, c);
        },
        interval: 5000,
    });

    // Show loading state
    if (status === 'checking' || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-64 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Error loading document</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-primary hover:underline"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!user || !document) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Toolbar */}
            <EditorToolbar
                editor={editor}
                title={title}
                onTitleChange={setTitle}
                saving={saving}
                lastSaved={lastSaved}
                onManualSave={manualSave}
                showOutline={showOutline}
                onToggleOutline={() => setShowOutline(!showOutline)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Outline Sidebar (Desktop) */}
                <div className={cn(
                    "hidden xl:block transition-all duration-300 ease-in-out border-r border-border/40 bg-background/50 backdrop-blur-sm",
                    showOutline ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"
                )}>
                    <DocumentOutline
                        editor={editor}
                        isOpen={showOutline}
                        onToggle={() => setShowOutline(!showOutline)}
                    />
                </div>

                {/* Editor Canvas */}
                <div className="flex-1 flex justify-center px-4 py-8 overflow-y-auto scroll-smooth">
                    <div className={cn(
                        "w-full max-w-[800px] bg-white rounded-xl shadow-sm border border-black/5 min-h-[calc(100vh-140px)] p-12 md:p-16 transition-all duration-300",
                        "prose-headings:font-serif prose-headings:font-medium prose-p:font-sans prose-p:text-lg prose-p:leading-relaxed"
                    )}>
                        <TipTapEditor
                            content={content}
                            onChange={setContent}
                            onEditorReady={setEditor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
