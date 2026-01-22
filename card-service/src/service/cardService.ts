import { prisma } from "../config/prisma";
import type { PrismaClient } from "../prisma/client";
import type { CardModel } from "../prisma/models/Card.ts";
import type { Color} from "../prisma/enums.js";

export const getCardForDeck = async (deckCards: string[],take = 50, lastId?: string): Promise<{ cards: CardModel[]; nextCursor: string | null }> => {

    const query: Parameters<PrismaClient['card']['findMany']>[0] = {
      take,
        where: {
        id: { in: deckCards },
      },
      orderBy: { createdAt: 'desc' },
      ...(lastId && {
        cursor: { id: lastId }, 
        skip: 1,               
      }),
    };


    const cards = await prisma.card.findMany(query);

    const nextCursor = cards.length > 0 ? cards[cards.length - 1]!.id : null;

    return { cards, nextCursor };
}

export const getCardFromColorForDeck = async (deckColor: Color[],take = 50, lastId?: string): Promise<{ cards: CardModel[]; nextCursor: string | null }> => {

    const query: Parameters<PrismaClient['card']['findMany']>[0] = {
      take,
        where: {
        colors: { hasSome: deckColor },
      },
      orderBy: { createdAt: 'asc' },
      ...(lastId && {
        cursor: { id: lastId }, 
        skip: 1,               
      }),
    };


    const cards = await prisma.card.findMany(query);

    const nextCursor = cards.length > 0 ? cards[cards.length - 1]!.id : null;

    return { cards, nextCursor };
}

export const getCardFromSearch = async (search: string,take = 50, lastId?: string): Promise<{ cards: CardModel[]; nextCursor: string | null }> => {

    const query: Parameters<PrismaClient['card']['findMany']>[0] = {
        take,
        where: {
            name: { contains: search, mode: 'insensitive' },
            oracleText: { contains: search, mode: 'insensitive' },
        },
        orderBy: { createdAt: 'asc' },  
        ...(lastId && {
            cursor: { id: lastId },
            skip: 1,
        }),
    };
    const cards = await prisma.card.findMany(query);

    const nextCursor = cards.length > 0 ? cards[cards.length - 1]!.id : null;
    return { cards, nextCursor };
}