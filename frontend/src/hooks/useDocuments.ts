import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { docsApi } from '@/lib/api';
import type { Document } from '@/types/document';

export const useDocuments = () => {
    const { accessToken } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const docs = await docsApi.list(accessToken);
                setDocuments(docs);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch documents');
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [accessToken]);

    return { documents, loading, error };
};
