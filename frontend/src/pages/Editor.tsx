import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDocument } from '@/hooks/useDocument';
import { useAutosave } from '@/hooks/useAutosave';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from '@/components/editor/EditorToolbar';

const Editor = () => {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const { user, status } = useAuth();
    const { document, loading, error, saveDocument } = useDocument(docId || '');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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

    // TipTap editor setup
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px]',
            },
        },
    });

    // Update editor content when document loads
    useEffect(() => {
        if (editor && document) {
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
        <div className="min-h-screen bg-background">
            {/* Toolbar */}
            <EditorToolbar
                editor={editor}
                title={title}
                onTitleChange={setTitle}
                saving={saving}
                lastSaved={lastSaved}
                onManualSave={manualSave}
            />

            {/* Editor Canvas */}
            <div className="flex justify-center px-4 py-8">
                <div className="w-full max-w-[760px] bg-card rounded-xl shadow-card p-12">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

export default Editor;
