import { ArrowLeft, Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, Undo, Redo, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SaveIndicator } from './SaveIndicator';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';

interface EditorToolbarProps {
    editor: Editor | null;
    title: string;
    onTitleChange: (title: string) => void;
    saving: boolean;
    lastSaved: Date | null;
    onManualSave: () => void;
}

export const EditorToolbar = ({
    editor,
    title,
    onTitleChange,
    saving,
    lastSaved,
    onManualSave,
}: EditorToolbarProps) => {
    const navigate = useNavigate();

    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, icon: Icon, label }: any) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`h-8 w-8 p-0 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="sticky top-0 z-50 bg-card border-b border-border">
            {/* Top row: Back button, Title, Save indicator */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="max-w-md border-none shadow-none text-base font-medium focus-visible:ring-0 px-2"
                        placeholder="Untitled Document"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <SaveIndicator saving={saving} lastSaved={lastSaved} />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onManualSave}
                        disabled={saving}
                        className="gap-2"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>

            {/* Format toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    label="Bold (Cmd+B)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    label="Italic (Cmd+I)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon={UnderlineIcon}
                    label="Underline (Cmd+U)"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    label="Heading 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    label="Heading 2"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    label="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    label="Numbered List"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={AlignLeft}
                    label="Align Left"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={AlignCenter}
                    label="Align Center"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={AlignRight}
                    label="Align Right"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={() => {
                        const url = window.prompt('Enter URL:');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    isActive={editor.isActive('link')}
                    icon={LinkIcon}
                    label="Add Link"
                />

                <Separator orientation="vertical" className="h-6 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    isActive={false}
                    icon={Undo}
                    label="Undo (Cmd+Z)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    isActive={false}
                    icon={Redo}
                    label="Redo (Cmd+Shift+Z)"
                />
            </div>
        </div>
    );
};
