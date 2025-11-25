import { DocumentCard } from './DocumentCard';
import { TemplateCard } from './TemplateCard';
import { EmptyState } from './EmptyState';
import { DocumentSkeleton } from './DocumentSkeleton';

interface Document {
    id: string;
    title: string;
    updatedAt: Date;
    preview?: string;
}

interface DocumentGridProps {
    documents?: Document[];
    loading?: boolean;
}

const templates = [
    { type: 'blank' as const, title: 'Blank Document', description: 'Start from scratch' },
    { type: 'essay' as const, title: 'Essay', description: 'Structured writing' },
    { type: 'notes' as const, title: 'Notes', description: 'Quick thoughts' },
    { type: 'journal' as const, title: 'Journal', description: 'Daily reflections' },
    { type: 'meeting-notes' as const, title: 'Meeting Notes', description: 'Capture discussions' },
];

export const DocumentGrid = ({ documents = [], loading = false }: DocumentGridProps) => {
    const hasDocuments = documents.length > 0;

    return (
        <div className="space-y-8">
            {/* Templates Section */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Start a new document
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.type}
                            type={template.type}
                            title={template.title}
                            description={template.description}
                        />
                    ))}
                </div>
            </section>

            {/* Recent Documents Section */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Recent documents
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <DocumentSkeleton key={i} />
                        ))}
                    </div>
                ) : hasDocuments ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {documents.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                id={doc.id}
                                title={doc.title}
                                updatedAt={doc.updatedAt}
                                preview={doc.preview}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </section>
        </div>
    );
};
