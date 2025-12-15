-- CreateEnum
CREATE TYPE "DeckFormat" AS ENUM ('Standard', 'Pioneer', 'Modern', 'Legacy', 'Vintage', 'Commander', 'Pauper', 'Historic');

-- CreateEnum
CREATE TYPE "DeckVisibility" AS ENUM ('Private', 'Unlisted', 'Public');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "format" "DeckFormat" NOT NULL,
    "visibility" "DeckVisibility" NOT NULL DEFAULT 'Private',
    "ownerId" INTEGER NOT NULL,
    "commanderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckCard" (
    "id" SERIAL NOT NULL,
    "deckId" INTEGER NOT NULL,
    "cardId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "DeckCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeckCard_deckId_cardId_key" ON "DeckCard"("deckId", "cardId");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckCard" ADD CONSTRAINT "DeckCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
