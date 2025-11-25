import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { docsApi } from '@/lib/api';
import { useState } from 'react';

export const NewDocumentButton = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [creating, setCreating] = useState(false);

    const handleClick = async () => {
        if (!accessToken) return;

        try {
            setCreating(true);
            const doc = await docsApi.create({ title: 'Untitled Document' }, accessToken);
            navigate(`/editor/${doc.id}`);
        } catch (error) {
            console.error('Failed to create document:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={creating}
            size="icon"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        >
            <Plus className="h-6 w-6" />
        </Button>
    );
};
