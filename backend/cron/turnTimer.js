const { prisma } = require('../config/db');

// This function will run periodically
const checkExpiredTurns = async () => {
    try {
        const now = new Date();

        // Find active rooms where turn has expired
        const expiredRooms = await prisma.storyRoom.findMany({
            where: {
                status: 'active',
                turnEndsAt: {
                    lt: now,
                },
            },
        });

        for (const room of expiredRooms) {
            console.log(`Auto-skipping turn in room ${room.id} (expired at ${room.turnEndsAt})`);

            try {
                await prisma.$transaction(async (prisma) => {
                    // Double check inside transaction
                    const currentRoom = await prisma.storyRoom.findUnique({ where: { id: room.id } });
                    if (currentRoom.turnEndsAt > now || currentRoom.status !== 'active') return;

                    // Skip turn logic
                    await prisma.storyRoom.update({
                        where: { id: room.id },
                        data: {
                            currentTurnIndex: { increment: 1 },
                            turnStartedAt: now,
                            turnEndsAt: new Date(now.getTime() + room.turnTimeLimit * 1000),
                        },
                    });

                    // Ideally we would broadcast here via Socket.io
                    // but since we rely on polling, next poll will pick it up
                });
            } catch (err) {
                console.error(`Failed to auto-skip room ${room.id}`, err);
            }
        }
    } catch (error) {
        console.error('Timer worker error:', error);
    }
};

const initTurnTimer = () => {
    console.log('Turn timer worker started...');
    // Run every 2 seconds
    setInterval(checkExpiredTurns, 2000);
};

module.exports = { initTurnTimer };
