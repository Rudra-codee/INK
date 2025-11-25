import { Editor } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Code, Terminal,
    ArrowLeft, Save, Undo, Redo, Link as LinkIcon,
    Type, LayoutList, MessageSquare, ChevronDown, Minus, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SaveIndicator } from './SaveIndicator';
import { ColorPicker } from './ColorPicker';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
    editor: Editor | null;
    title: string;
    onTitleChange: (title: string) => void;
    saving: boolean;
    lastSaved: Date | null;
    onManualSave: () => void;
    showOutline: boolean;
    onToggleOutline: () => void;
}

export const EditorToolbar = ({
    editor,
    title,
    onTitleChange,
    saving,
    lastSaved,
    onManualSave,
    showOutline,
    onToggleOutline,
}: EditorToolbarProps) => {
    const navigate = useNavigate();
    const [fontSize, setFontSize] = useState('16');

    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, icon: Icon, label, disabled = false }: any) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "h-9 w-9 p-0 rounded-lg transition-all duration-200",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-foreground hover:bg-muted"
            )}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const getCurrentHeadingLevel = () => {
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        if (editor.isActive('heading', { level: 4 })) return 'h4';
        return 'normal';
    };

    const setHeadingLevel = (value: string) => {
        if (value === 'normal') {
            editor.chain().focus().setParagraph().run();
        } else if (value === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
        } else if (value === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
        } else if (value === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
        } else if (value === 'h4') {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
            {/* Top Row: Navigation & Title */}
            <div className="flex items-center justify-between px-4 h-12 border-b border-border/50">
                <div className="flex items-center gap-3 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="gap-2 text-muted-foreground hover:text-foreground h-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline text-sm">Back</span>
                    </Button>

                    <div className="h-4 w-[1px] bg-border" />

                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="max-w-md border-none shadow-none text-sm font-medium focus-visible:ring-0 px-2 h-8 bg-transparent"
                        placeholder="Untitled Document"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <SaveIndicator saving={saving} lastSaved={lastSaved} />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleOutline}
                        className={cn(
                            "h-8 w-8 p-0",
                            showOutline && "bg-muted text-primary"
                        )}
                        title="Toggle Outline"
                    >
                        <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={onManualSave}
                        disabled={saving}
                        className="gap-2 h-8 px-3"
                    >
                        <Save className="h-3.5 w-3.5" />
                        <span className="text-sm">Save</span>
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Compact Formatting Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-hide">
                {/* Heading Selector */}
                <Select value={getCurrentHeadingLevel()} onValueChange={setHeadingLevel}>
                    <SelectTrigger className="h-9 w-[110px] text-sm border-none shadow-none hover:bg-muted">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="h1">Heading 1</SelectItem>
                        <SelectItem value="h2">Heading 2</SelectItem>
                        <SelectItem value="h3">Heading 3</SelectItem>
                        <SelectItem value="h4">Heading 4</SelectItem>
                    </SelectContent>
                </Select>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Font Size Controls */}
                <div className="flex items-center gap-0.5 bg-muted/50 rounded-lg px-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-background"
                        onClick={() => {
                            const newSize = Math.max(8, parseInt(fontSize) - 2);
                            setFontSize(newSize.toString());
                        }}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="h-7 w-12 text-center text-sm border-none shadow-none bg-transparent focus-visible:ring-0 px-1"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-background"
                        onClick={() => {
                            const newSize = Math.min(72, parseInt(fontSize) + 2);
                            setFontSize(newSize.toString());
                        }}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Text Formatting */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                        label="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                        label="Italic"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon={UnderlineIcon}
                        label="Underline"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        icon={Strikethrough}
                        label="Strikethrough"
                    />
                </div>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Colors */}
                <div className="flex items-center gap-0.5">
                    <ColorPicker
                        currentColor={editor.getAttributes('textStyle').color}
                        onChange={(color) => editor.chain().focus().setColor(color).run()}
                        type="text"
                    />
                    <ColorPicker
                        currentColor={editor.getAttributes('highlight').color}
                        onChange={(color) => color === 'transparent'
                            ? editor.chain().focus().unsetHighlight().run()
                            : editor.chain().focus().toggleHighlight({ color }).run()
                        }
                        type="highlight"
                    />
                </div>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Alignment */}
                <div className="flex items-center gap-0.5">
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
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        icon={AlignJustify}
                        label="Justify"
                    />
                </div>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-0.5">
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
                </div>

                <div className="h-6 w-[1px] bg-border mx-1" />

                {/* Insert Elements */}
                <div className="flex items-center gap-0.5">
                    <ToolbarButton
                        onClick={setLink}
                        isActive={editor.isActive('link')}
                        icon={LinkIcon}
                        label="Link"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        icon={Quote}
                        label="Quote"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        icon={Code}
                        label="Code"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        icon={Terminal}
                        label="Code Block"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 rounded-lg hover:bg-muted"
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => editor.chain().focus().setCallout('info').run()}>
                                Info Callout
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().setCallout('warning').run()}>
                                Warning Callout
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().setCallout('success').run()}>
                                Success Callout
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().setCallout('error').run()}>
                                Error Callout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};
