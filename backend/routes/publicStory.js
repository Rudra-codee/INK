const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');

router.get('/story/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const room = await prisma.storyRoom.findUnique({
            where: { publicSlug: slug },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                characters: true,
                turns: {
                    include: {
                        user: { select: { id: true, name: true } }
                    },
                    orderBy: { turnOrder: 'asc' }
                }
            }
        });

        if (!room) return res.status(404).json({ error: 'Story not found' });
        if (!room.isPublic) return res.status(403).json({ error: 'This story is not public yet.' });

        // Filter sensitive data manually if needed, but select above handles most
        res.json(room);

    } catch (error) {
        console.error('Fetch public story error:', error);
        res.status(500).json({ error: 'Failed to load story' });
    }
});

module.exports = router;
