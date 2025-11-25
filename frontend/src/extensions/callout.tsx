import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export interface CalloutOptions {
    types: string[];
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callout: {
            setCallout: (type: 'info' | 'warning' | 'success' | 'error') => ReturnType;
        };
    }
}

const CalloutComponent = ({ node }: any) => {
    const type = node.attrs.type || 'info';

    const config = {
        info: {
            icon: Info,
            bg: 'rgba(0, 87, 216, 0.1)',
            border: '#0057D8',
            text: '#0057D8',
        },
        warning: {
            icon: AlertTriangle,
            bg: 'rgba(234, 179, 8, 0.1)',
            border: '#EAB308',
            text: '#A16207',
        },
        success: {
            icon: CheckCircle,
            bg: 'rgba(22, 163, 74, 0.1)',
            border: '#16A34A',
            text: '#15803D',
        },
        error: {
            icon: AlertCircle,
            bg: 'rgba(220, 38, 38, 0.1)',
            border: '#DC2626',
            text: '#B91C1C',
        },
    };

    const { icon: Icon, bg, border, text } = config[type as keyof typeof config];

    return (
        <NodeViewWrapper>
        <div
        style= {{
        padding: '16px',
            borderRadius: '8px',
                borderLeft: `4px solid ${border}`,
                    backgroundColor: bg,
                        margin: '16px 0',
                            display: 'flex',
                                gap: '12px',
                                    alignItems: 'start',
        }
}
      >
    <Icon style={ { width: '20px', height: '20px', color: text, flexShrink: 0, marginTop: '2px' } } />
        < div style = {{ flex: 1, color: text }} contentEditable suppressContentEditableWarning >
            { node.textContent || 'Type your callout message...' }
            </div>
            </div>
            </NodeViewWrapper>
  );
};

export const Callout = Node.create<CalloutOptions>({
    name: 'callout',

    group: 'block',

    content: 'inline*',

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: element => element.getAttribute('data-type'),
                renderHTML: attributes => {
                    return {
                        'data-type': attributes.type,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="callout"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CalloutComponent);
    },

    addCommands() {
        return {
            setCallout: (type) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: { type },
                    content: [{ type: 'text', text: 'Type your callout message...' }],
                });
            },
        };
    },
});
