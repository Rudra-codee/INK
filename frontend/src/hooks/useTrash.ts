import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { docsApi } from '@/lib/api';
import type { Document } from '@/types/document';

export const useTrash = () => {
    const { accessToken } = useAuth();
    const [trashedDocs, setTrashedDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTrash = async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const docs = await docsApi.getTrash(accessToken);
            setTrashedDocs(docs);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch trash');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, [accessToken]);

    return { trashedDocs, loading, error, refetch: fetchTrash };
};
