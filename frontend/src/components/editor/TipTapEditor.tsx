import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Strike from '@tiptap/extension-strike';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import { Callout } from '@/extensions/callout';

interface TipTapEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
    onEditorReady?: (editor: any) => void;
}

export const TipTapEditor = ({ content, onChange, editable = true, onEditorReady }: TipTapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
                codeBlock: false, // Use separate CodeBlock extension
                blockquote: false, // Use separate Blockquote extension
            }),
            Underline,
            Strike,
            Code,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-muted p-4 rounded-lg font-mono text-sm my-4',
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'border-l-4 border-primary pl-4 italic text-muted-foreground my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline hover:text-primary/80',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Placeholder.configure({
                placeholder: 'Start writing...',
            }),
            Callout,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] leading-relaxed',
            },
        },
        onCreate: ({ editor }) => {
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
    });

    return <EditorContent editor={editor} />;
};
