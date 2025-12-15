-- CreateEnum
CREATE TYPE "Color" AS ENUM ('W', 'U', 'B', 'R', 'G');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('Creature', 'Sorcery', 'Instant', 'Artifact', 'Enchantment', 'Land', 'Planeswalker', 'Battle');

-- CreateEnum
CREATE TYPE "CardSupertype" AS ENUM ('Legendary', 'Basic', 'Snow');

-- CreateEnum
CREATE TYPE "DeckFormat" AS ENUM ('Standard', 'Pioneer', 'Modern', 'Legacy', 'Vintage', 'Commander', 'Pauper', 'Historic');

-- CreateEnum
CREATE TYPE "DeckVisibility" AS ENUM ('Private', 'Unlisted', 'Public');

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "oracleText" TEXT,
    "manaValue" INTEGER NOT NULL,
    "types" "CardType"[],
    "supertypes" "CardSupertype"[],
    "subtypes" TEXT[],
    "colors" "Color"[],
    "colorIdentity" "Color"[],
    "power" TEXT,
    "toughness" TEXT,
    "loyalty" TEXT,
    "defense" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardMana" (
    "id" SERIAL NOT NULL,
    "cardId" TEXT NOT NULL,
    "color" "Color",
    "amount" INTEGER NOT NULL,

    CONSTRAINT "CardMana_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardLegality" (
    "cardId" TEXT NOT NULL,
    "format" "DeckFormat" NOT NULL,
    "legal" BOOLEAN NOT NULL,

    CONSTRAINT "CardLegality_pkey" PRIMARY KEY ("cardId","format")
);

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CardMana_cardId_color_key" ON "CardMana"("cardId", "color");

-- AddForeignKey
ALTER TABLE "CardMana" ADD CONSTRAINT "CardMana_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardLegality" ADD CONSTRAINT "CardLegality_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
