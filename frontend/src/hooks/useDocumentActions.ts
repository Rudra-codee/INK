import { useAuth } from './useAuth';
import { docsApi } from '@/lib/api';

export const useDocumentActions = () => {
    const { accessToken } = useAuth();

    const toggleFavorite = async (id: string, currentState: boolean) => {
        if (!accessToken) return;
        await docsApi.favorite(id, !currentState, accessToken);
    };

    const moveToTrash = async (id: string) => {
        if (!accessToken) return;
        await docsApi.trash(id, accessToken);
    };

    const restoreDocument = async (id: string) => {
        if (!accessToken) return;
        await docsApi.restore(id, accessToken);
    };

    const permanentDelete = async (id: string) => {
        if (!accessToken) return;
        await docsApi.deletePermanent(id, accessToken);
    };

    return { toggleFavorite, moveToTrash, restoreDocument, permanentDelete };
};
