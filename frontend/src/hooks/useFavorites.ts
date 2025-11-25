import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { docsApi } from '@/lib/api';
import type { Document } from '@/types/document';

export const useFavorites = () => {
    const { accessToken } = useAuth();
    const [favorites, setFavorites] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFavorites = async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const docs = await docsApi.getFavorites(accessToken);
            setFavorites(docs);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [accessToken]);

    return { favorites, loading, error, refetch: fetchFavorites };
};
