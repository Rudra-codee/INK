-- CreateTable
CREATE TABLE "StoryRoom" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "basePlot" TEXT,
    "turnTimeLimit" INTEGER NOT NULL DEFAULT 60,
    "wordLimit" INTEGER NOT NULL DEFAULT 100,
    "totalTurns" INTEGER NOT NULL DEFAULT 20,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "currentTurnIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryRoomMember" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryRoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryRoomCharacter" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "StoryRoomCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryTurn" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "turnOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryTurn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryRoomMember_roomId_userId_key" ON "StoryRoomMember"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "StoryRoomMember" ADD CONSTRAINT "StoryRoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "StoryRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRoomMember" ADD CONSTRAINT "StoryRoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRoomCharacter" ADD CONSTRAINT "StoryRoomCharacter_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "StoryRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryTurn" ADD CONSTRAINT "StoryTurn_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "StoryRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryTurn" ADD CONSTRAINT "StoryTurn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
