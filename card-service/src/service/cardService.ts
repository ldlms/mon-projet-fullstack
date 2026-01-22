import { prisma } from "../config/prisma";
import type { Card } from "../type";

export const getCardForDeck = async (deckCards: string[]): Promise<Card[] | null> => {
    const cards:Card[] = await prisma.card.findMany({
        where: {
            id: {
                in: deckCards
            }
        }
    });

    return cards;
}