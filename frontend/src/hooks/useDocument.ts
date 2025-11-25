import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { docsApi } from '@/lib/api';
import type { Document } from '@/types/document';

export const useDocument = (docId: string) => {
    const { accessToken } = useAuth();
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            if (!accessToken || !docId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const doc = await docsApi.get(docId, accessToken);
                setDocument(doc);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch document');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [docId, accessToken]);

    const saveDocument = useCallback(
        async (title: string, content: string) => {
            if (!accessToken || !docId) return;

            try {
                const updated = await docsApi.update(docId, { title, content }, accessToken);
                setDocument(updated);
                return updated;
            } catch (err) {
                throw new Error(err instanceof Error ? err.message : 'Failed to save document');
            }
        },
        [docId, accessToken]
    );

    return { document, loading, error, saveDocument };
};
