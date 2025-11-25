import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, StickyNote, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { docsApi } from '@/lib/api';
import { generateTemplate, type TemplateType } from '@/lib/templates';
import { useState } from 'react';

interface TemplateCardProps {
    type: TemplateType;
    title: string;
    description: string;
}

const templateIcons: Record<TemplateType, any> = {
    blank: FileText,
    essay: BookOpen,
    notes: StickyNote,
    journal: Calendar,
    'meeting-notes': Briefcase,
};

export const TemplateCard = ({ type, title, description }: TemplateCardProps) => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [creating, setCreating] = useState(false);
    const Icon = templateIcons[type];

    const handleClick = async () => {
        if (!accessToken) return;

        try {
            setCreating(true);
            const template = generateTemplate(type);
            const doc = await docsApi.create(
                {
                    title: template.title,
                },
                accessToken
            );

            // Update the document with template content
            await docsApi.update(
                doc.id,
                { content: template.content },
                accessToken
            );

            navigate(`/editor/${doc.id}`);
        } catch (error) {
            console.error('Failed to create document from template:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Card
            onClick={handleClick}
            className={`group cursor-pointer p-6 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] hover:border-primary/20 flex flex-col items-center text-center ${creating ? 'opacity-50 pointer-events-none' : ''
                }`}
        >
            {/* Icon with background */}
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                {creating ? 'Creating...' : title}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
        </Card>
    );
};
