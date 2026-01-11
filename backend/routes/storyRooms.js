const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const requireAuth = require('../middleware/auth');

// Helper to check if user is leader
const isLeader = async (roomId, userId) => {
    const member = await prisma.storyRoomMember.findUnique({
        where: {
            roomId_userId: {
                roomId,
                userId,
            },
        },
    });
    return member && member.role === 'LEADER';
};

// Create a new room
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, basePlot, turnTimeLimit, wordLimit, totalTurns, characters } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await prisma.$transaction(async (prisma) => {
            // 1. Create Room
            const room = await prisma.storyRoom.create({
                data: {
                    title,
                    basePlot,
                    turnTimeLimit: turnTimeLimit || 60,
                    wordLimit: wordLimit || 100,
                    totalTurns: totalTurns || 20,
                    status: 'waiting',
                },
            });

            // 2. Add Leader
            await prisma.storyRoomMember.create({
                data: {
                    roomId: room.id,
                    userId: req.user.id,
                    role: 'LEADER',
                },
            });

            // 3. Add Characters
            if (characters && characters.length > 0) {
                await prisma.storyRoomCharacter.createMany({
                    data: characters.map((char) => ({
                        roomId: room.id,
                        name: char.name,
                        description: char.description,
                    })),
                });
            }

            return room;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
});

// Join a room
router.post('/:roomId/join', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.storyRoom.findUnique({ where: { id: roomId } });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Check if already a member
        const existingMember = await prisma.storyRoomMember.findUnique({
            where: { roomId_userId: { roomId, userId: req.user.id } },
        });

        if (existingMember) {
            return res.status(400).json({ error: 'Already joined this room' });
        }

        await prisma.storyRoomMember.create({
            data: {
                roomId,
                userId: req.user.id,
                role: 'WRITER',
            },
        });

        res.json({ message: 'Joined successfully' });
    } catch (error) {
        console.error('Join room error:', error);
        res.status(500).json({ error: 'Failed to join room' });
    }
});

// Get room details
router.get('/:roomId', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await prisma.storyRoom.findUnique({
            where: { id: roomId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatar: true },
                        },
                    },
                },
                characters: true,
                turns: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { turnOrder: 'asc' },
                },
            },
        });

        if (!room) return res.status(404).json({ error: 'Room not found' });

        res.json(room);
    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
});

// Start the room (Leader only)
router.post('/:roomId/start', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!(await isLeader(roomId, req.user.id))) {
            return res.status(403).json({ error: 'Only leader can start the room' });
        }

        const updatedRoom = await prisma.storyRoom.update({
            where: { id: roomId },
            data: {
                status: 'active',
                turnStartedAt: new Date(),
                turnEndsAt: new Date(Date.now() + (await prisma.storyRoom.findUnique({ where: { id: roomId } })).turnTimeLimit * 1000)
            },
        });

        res.json(updatedRoom);
    } catch (error) {
        console.error('Start room error:', error);
        res.status(500).json({ error: 'Failed to start room' });
    }
});

// Submit a turn
router.post('/:roomId/turn', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;
        const { content } = req.body;

        const room = await prisma.storyRoom.findUnique({ where: { id: roomId } });
        if (!room) return res.status(404).json({ error: 'Room not found' });

        if (room.status !== 'active') {
            return res.status(400).json({ error: 'Room is not active' });
        }

        // Determine whose turn it is
        // fetch all writers sorted by join time
        const writers = await prisma.storyRoomMember.findMany({
            where: { roomId, role: { in: ['LEADER', 'WRITER'] } },
            orderBy: { joinedAt: 'asc' },
        });

        if (writers.length === 0) return res.status(400).json({ error: 'No writers in room' });

        const currentWriterIndex = room.currentTurnIndex % writers.length;
        const currentWriter = writers[currentWriterIndex];

        if (currentWriter.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not your turn' });
        }

        // Validate word limit
        const wordCount = content.trim().split(/\s+/).length;
        if (wordCount > room.wordLimit + 10) { // allow small buffer
            return res.status(400).json({ error: `Word limit exceeded (max ${room.wordLimit})` });
        }

        const turn = await prisma.$transaction(async (prisma) => {
            // Create turn
            const newTurn = await prisma.storyTurn.create({
                data: {
                    roomId,
                    userId: req.user.id,
                    content,
                    turnOrder: room.currentTurnIndex + 1,
                },
            });

            // Advance turn index
            await prisma.storyRoom.update({
                where: { id: roomId },
                data: {
                    currentTurnIndex: { increment: 1 },
                    turnStartedAt: new Date(),
                    turnEndsAt: new Date(Date.now() + room.turnTimeLimit * 1000),
                },
            });

            return newTurn;
        });

        res.json(turn);
    } catch (error) {
        console.error('Submit turn error:', error);
        res.status(500).json({ error: 'Failed to submit turn' });
    }
});

// Skip current writer (Leader only)
router.post('/:roomId/skip', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!(await isLeader(roomId, req.user.id))) {
            return res.status(403).json({ error: 'Only leader can skip turns' });
        }

        await prisma.storyRoom.update({
            where: { id: roomId },
            data: {
                currentTurnIndex: { increment: 1 },
                turnStartedAt: new Date(),
                turnEndsAt: new Date(Date.now() + (await prisma.storyRoom.findUnique({ where: { id: roomId } })).turnTimeLimit * 1000),
            },
        });

        res.json({ message: 'Turn skipped' });
    } catch (error) {
        console.error('Skip turn error:', error);
        res.status(500).json({ error: 'Failed to skip turn' });
    }
});

// Finish the story (Leader only or Auto)
router.post('/:roomId/finish', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!(await isLeader(roomId, req.user.id))) {
            return res.status(403).json({ error: 'Only leader can finish the room' });
        }

        const room = await prisma.storyRoom.findUnique({ where: { id: roomId } });
        if (room.status === 'finished') return res.json(room);

        // Generate slug
        const cleanTitle = room.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
        const slug = `${cleanTitle}-${uniqueSuffix}`;

        const updatedRoom = await prisma.storyRoom.update({
            where: { id: roomId },
            data: {
                status: 'finished',
                finishedAt: new Date(),
                publicSlug: slug
            },
        });

        res.json(updatedRoom);
    } catch (error) {
        console.error('Finish room error:', error);
        res.status(500).json({ error: 'Failed to finish room' });
    }
});

// Publish story (Leader only)
router.post('/:roomId/publish', requireAuth, async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!(await isLeader(roomId, req.user.id))) {
            return res.status(403).json({ error: 'Only leader can publish' });
        }

        const updatedRoom = await prisma.storyRoom.update({
            where: { id: roomId },
            data: { isPublic: true },
        });

        res.json(updatedRoom);
    } catch (error) {
        console.error('Publish room error:', error);
        res.status(500).json({ error: 'Failed to publish room' });
    }
});


module.exports = router;
