import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, BookOpen, StickyNote, Calendar, Briefcase } from 'lucide-react';

interface TemplateCardProps {
    type: 'blank' | 'essay' | 'notes' | 'journal' | 'meeting';
    title: string;
    description: string;
}

const templateIcons = {
    blank: FileText,
    essay: BookOpen,
    notes: StickyNote,
    journal: Calendar,
    meeting: Briefcase,
};

export const TemplateCard = ({ type, title, description }: TemplateCardProps) => {
    const navigate = useNavigate();
    const Icon = templateIcons[type];

    const handleClick = () => {
        // Create new document with template type
        const tempId = `new-${type}-${Date.now()}`;
        navigate(`/editor/${tempId}?template=${type}`);
    };

    return (
        <Card
            onClick={handleClick}
            className="group cursor-pointer p-6 transition-all duration-200 hover:shadow-card-hover hover:scale-[1.02] hover:border-primary/20 flex flex-col items-center text-center"
        >
            {/* Icon with background */}
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-8 w-8 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground">
                {description}
            </p>
        </Card>
    );
};
