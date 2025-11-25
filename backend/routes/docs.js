const express = require('express');
const { prisma } = require('../config/db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create a new document
router.post('/create', async (req, res) => {
    try {
        const { title = 'Untitled Document' } = req.body;
        const userId = req.user.id;

        const document = await prisma.document.create({
            data: {
                title,
                ownerId: userId,
                content: '',
            },
        });

        return res.status(201).json(document);
    } catch (error) {
        console.error('Create document error:', error);
        return res.status(500).json({ error: 'Unable to create document.' });
    }
});

// Get all documents for the authenticated user (excluding trashed)
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        const documents = await prisma.document.findMany({
            where: {
                ownerId: userId,
                trashed: false,
            },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                content: true,
                favorite: true,
                trashed: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.json(documents);
    } catch (error) {
        console.error('List documents error:', error);
        return res.status(500).json({ error: 'Unable to fetch documents.' });
    }
});

// Get a specific document
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const document = await prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        // Check ownership
        if (document.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        return res.json(document);
    } catch (error) {
        console.error('Get document error:', error);
        return res.status(500).json({ error: 'Unable to fetch document.' });
    }
});

// Update a document
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, content } = req.body;

        // Check if document exists and user owns it
        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        // Update document
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        const document = await prisma.document.update({
            where: { id },
            data: updateData,
        });

        return res.json(document);
    } catch (error) {
        console.error('Update document error:', error);
        return res.status(500).json({ error: 'Unable to update document.' });
    }
});

// Delete a document
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if document exists and user owns it
        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        await prisma.document.delete({
            where: { id },
        });

        return res.json({ ok: true });
    } catch (error) {
        console.error('Delete document error:', error);
        return res.status(500).json({ error: 'Unable to delete document.' });
    }
});

// Get favorite documents
router.get('/favorites', async (req, res) => {
    try {
        const userId = req.user.id;

        const documents = await prisma.document.findMany({
            where: {
                ownerId: userId,
                favorite: true,
                trashed: false,
            },
            orderBy: { updatedAt: 'desc' },
        });

        return res.json(documents);
    } catch (error) {
        console.error('Get favorites error:', error);
        return res.status(500).json({ error: 'Unable to fetch favorites.' });
    }
});

// Get trashed documents
router.get('/trash', async (req, res) => {
    try {
        const userId = req.user.id;

        const documents = await prisma.document.findMany({
            where: {
                ownerId: userId,
                trashed: true,
            },
            orderBy: { updatedAt: 'desc' },
        });

        return res.json(documents);
    } catch (error) {
        console.error('Get trash error:', error);
        return res.status(500).json({ error: 'Unable to fetch trash.' });
    }
});

// Toggle favorite status
router.put('/:id/favorite', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { favorite } = req.body;

        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const document = await prisma.document.update({
            where: { id },
            data: { favorite: favorite !== undefined ? favorite : !existingDoc.favorite },
        });

        return res.json(document);
    } catch (error) {
        console.error('Toggle favorite error:', error);
        return res.status(500).json({ error: 'Unable to update favorite status.' });
    }
});

// Move document to trash (soft delete)
router.put('/:id/trash', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const document = await prisma.document.update({
            where: { id },
            data: { trashed: true },
        });

        return res.json(document);
    } catch (error) {
        console.error('Trash document error:', error);
        return res.status(500).json({ error: 'Unable to trash document.' });
    }
});

// Restore document from trash
router.put('/:id/restore', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        const document = await prisma.document.update({
            where: { id },
            data: { trashed: false },
        });

        return res.json(document);
    } catch (error) {
        console.error('Restore document error:', error);
        return res.status(500).json({ error: 'Unable to restore document.' });
    }
});

// Permanently delete document (only if already trashed)
router.delete('/:id/permanent', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const existingDoc = await prisma.document.findUnique({
            where: { id },
        });

        if (!existingDoc) {
            return res.status(404).json({ error: 'Document not found.' });
        }

        if (existingDoc.ownerId !== userId) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        if (!existingDoc.trashed) {
            return res.status(400).json({ error: 'Document must be trashed before permanent deletion.' });
        }

        await prisma.document.delete({
            where: { id },
        });

        return res.json({ ok: true });
    } catch (error) {
        console.error('Permanent delete error:', error);
        return res.status(500).json({ error: 'Unable to permanently delete document.' });
    }
});

module.exports = router;
