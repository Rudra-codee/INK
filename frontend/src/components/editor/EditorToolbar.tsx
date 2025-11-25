import { Editor } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Code, Terminal,
    Heading1, Heading2, Heading3, Heading4,
    ArrowLeft, Save, Undo, Redo, Link as LinkIcon,
    Type, LayoutList, MessageSquare, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SaveIndicator } from './SaveIndicator';
import { ColorPicker } from './ColorPicker';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
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

    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, icon: Icon, label, disabled = false }: any) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "h-8 w-8 p-0 rounded-md transition-all duration-200",
                isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
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

    return (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 transition-all duration-200">
            {/* Top Row: Navigation & Title */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-border/40">
                <div className="flex items-center gap-4 flex-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Button>

                    <div className="h-4 w-[1px] bg-border/60" />

                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="max-w-md border-none shadow-none text-base font-medium focus-visible:ring-0 px-2 h-9 bg-transparent"
                        placeholder="Untitled Document"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <SaveIndicator saving={saving} lastSaved={lastSaved} />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onManualSave}
                        disabled={saving}
                        className="gap-2 h-8"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleOutline}
                        className={cn(
                            "h-8 w-8 p-0",
                            showOutline && "bg-primary/10 text-primary"
                        )}
                        title="Toggle Outline"
                    >
                        <LayoutList className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Formatting Tools */}
            <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto no-scrollbar">
                {/* History */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/40 mr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        icon={Undo}
                        label="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        icon={Redo}
                        label="Redo"
                    />
                </div>

                {/* Text Style */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/40 mr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 font-normal text-muted-foreground hover:text-foreground">
                                <Type className="h-4 w-4" />
                                <span className="hidden sm:inline text-xs">Normal</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                                <Type className="h-4 w-4 mr-2" /> Normal Text
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                                <Heading1 className="h-4 w-4 mr-2" /> Heading 1
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                                <Heading2 className="h-4 w-4 mr-2" /> Heading 2
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                                <Heading3 className="h-4 w-4 mr-2" /> Heading 3
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
                                <Heading4 className="h-4 w-4 mr-2" /> Heading 4
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Basic Formatting */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/40 mr-2">
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

                {/* Alignment */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/40 mr-2">
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

                {/* Lists & Indent */}
                <div className="flex items-center gap-0.5 pr-2 border-r border-border/40 mr-2">
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

                {/* Special Blocks */}
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
                        label="Inline Code"
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
                                className="h-8 w-8 p-0 rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
