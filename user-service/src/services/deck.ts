import { prisma } from '../config/prisma';
import type { Deck } from '../types';
import type {UpdateDeckData} from '../types/index.ts';

export const getAllDecks = async () => {
    const decks = await prisma.deck.findMany({
        select: {
            id: true,           
              name:true,
              format: true,
              ownerId: true,
              cards: true,
              commanderId: true,
        }
    });
    return decks.map(d => ({
        id: d.id.toString(),
        name: d.name,
        format: d.format,
        ownerId: d.ownerId.toString(),
        cards: d.cards,
        commanderId: d.commanderId?.toString(),
    })) as Deck[];
}

export const getDeckById = async (id:string) => {
    const deck = await prisma.deck.findUnique({
        where: { id: parseInt(id) },   
        select: {
            id: true,           
            name:true,
            format: true,
            ownerId: true,
            cards: true,
            commanderId: true,
            colors:true,
        }
    });
    if (!deck) return null;
    return {
        id: deck.id.toString(),
        name: deck.name,
        format: deck.format,
        ownerId: deck.ownerId.toString(),
        cards: deck.cards,
        commanderId: deck.commanderId?.toString(),
        colors: deck.colors
    } as Deck;
}

export const createDeck =  async (deckData:Omit<Deck, 'id'>) => {
    const newDeck = await prisma.deck.create({
        data: {
            name: deckData.name,
            format: deckData.format,
            cards: {
                create: deckData.cards,
            },
            ownerId: parseInt(deckData.ownerId),
            commanderId: deckData.commanderId ? deckData.commanderId : null,
            imageUri: deckData.imageUri,
            colors: deckData.colors
        }
    });
    return {
        id: newDeck.id.toString(),
        name: newDeck.name,
        format: newDeck.format,
        ownerId: newDeck.ownerId.toString(),
        cards: [],
        commanderId: newDeck.commanderId?.toString(),
        imageUri:newDeck.imageUri.toString(),
        colors:newDeck.colors
    } as Deck;
}

export const updateDeck = async (
    id: string,
    deckData: UpdateDeckData,
) => {
    return prisma.deck.update({
        where: { id: Number(id) },
        data: {
            ...(deckData.name !== undefined && { name: deckData.name }),
            ...(deckData.format !== undefined && { format: deckData.format }),
            ...(deckData.commanderId !== undefined && {
                commanderId: deckData.commanderId,
            }),
        },
        select: {
            id: true,
            name: true,
            format: true,
            ownerId: true,
            cards: true,
            commanderId: true,
        }
    });
};

export const deleteDeck = async (id:string) => {
    const deleted = await prisma.deck.deleteMany({
        where: { id: parseInt(id) }
    });
    return deleted.count > 0;
};

export const addCardToDeck = async (deckId: string, cardId: string) => {
    const updatedDeck = await prisma.deck.update({
        where: { id: Number(deckId) },
        data: {
            cards: {
                upsert: {
                    where: {
                        deckId_cardId: {
                            deckId: Number(deckId),
                            cardId,
                        }
                    },
                    create: {
                        cardId,
                        quantity: 1,
                    },
                    update: {
                        quantity: {
                            increment: 1,
                        }
                    }
                }
            }
        },
        include: {
            cards: true,
        }
    });

    return {
        id: updatedDeck.id.toString(),
        name: updatedDeck.name,
        format: updatedDeck.format,
        ownerId: updatedDeck.ownerId.toString(),
        cards: updatedDeck.cards,
        commanderId: updatedDeck.commanderId ?? undefined,
        colors: updatedDeck.colors,
    } as Deck;
};

export const removeCardFromDeck = async (deckId: string, cardId: string) => {
    const existingDeckCard = await prisma.deckCard.findUnique({
        where: {
            deckId_cardId: {
                deckId: Number(deckId),
                cardId,
            }
        }
    });

    if (!existingDeckCard) {
        return null;
    }

    if (existingDeckCard.quantity > 1) {
        await prisma.deckCard.update({
            where: {
                deckId_cardId: {
                    deckId: Number(deckId),
                    cardId,
                }
            },
            data: {
                quantity: {
                    decrement: 1,
                }
            }
        });
    } else {
        await prisma.deckCard.delete({
            where: {
                deckId_cardId: {
                    deckId: Number(deckId),
                    cardId,
                }
            }
        });
    }

    const updatedDeck = await prisma.deck.findUnique({
        where: { id: Number(deckId) },
        include: { cards: true }
    });

    if (!updatedDeck) return null;

    return {
        id: updatedDeck.id.toString(),
        name: updatedDeck.name,
        format: updatedDeck.format,
        ownerId: updatedDeck.ownerId.toString(),
        cards: updatedDeck.cards,
        commanderId: updatedDeck.commanderId ?? undefined,
        colors: updatedDeck.colors,
    } as Deck;
};

export const getDecksByUserId = async (ownerId: string) => {
    const decks = await prisma.deck.findMany({
        where: { ownerId: parseInt(ownerId) },
        select: {
            id: true,           
            name:true,
            format: true,
            cards: true,
            ownerId: true,
            commanderId: true,
            imageUri:true,
            colors:true,
        }
    });
    const result = decks.map(deck => ({
        id: deck.id.toString(),
        name: deck.name,
        format: deck.format,
        ownerId: deck.ownerId.toString(),
        imageUri: deck.imageUri,
        cards: deck.cards.map(dc => ({
            id: dc.id,
            deckId: dc.deckId,
            cardId: dc.cardId,
            quantity: dc.quantity,
        })),
        commanderId: deck.commanderId ?? undefined,
        colors:deck.colors
    }));
    
    console.log('getDecksByUserId retourne:', result);
    console.log('Est un tableau?', Array.isArray(result));
    
    return result;
};