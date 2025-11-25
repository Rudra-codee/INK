export interface Document {
    id: string;
    ownerId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentCreatePayload {
    title?: string;
}

export interface DocumentUpdatePayload {
    title?: string;
    content?: string;
}
