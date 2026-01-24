import * as cardService from "../service/cardService.ts";
import type { Request, Response } from "express";
import type { Color } from "../../generated/prisma/enums.ts"


export const getCardForDeck = async (req:Request, res:Response) => {
    const deckCards  = req.body ?.deckCards as string[];
    if (!deckCards) {
        res.status(400).json({ message: 'Deck Cards is required' });
        return;
    }
    const cards = await cardService.getCardForDeck(deckCards);
    if (!cards) {
        res.status(404).json({ message: 'Card not found for the given Deck ID' });
        return;
    }

    res.status(200).json(cards);
}

export const getCardFromColorForDeck = async (req: Request, res: Response) => {
    const { colors, cursor, limit = 50 } = req.query;
    
    if (!colors) {
        res.status(400).json({ message: 'Deck Color is required' });
        return;
    }
    
    const deckColors = (colors as string).split(',') as Color[];
    
    const result = await cardService.getCardFromColorForDeck(
        deckColors, 
        Number(limit),
        cursor as string | undefined
    );
    
    if (!result || result.cards.length === 0) {
        res.status(404).json({ message: 'Card not found for the given Deck Color' });
        return;
    }
    
    res.status(200).json({
        cards: result.cards,
        nextCursor: result.nextCursor,
        hasMore: result.nextCursor !== null
    });
}

export const getCardFromSearch = async (req:Request, res:Response) => {
    const search = req.body ?.search as string;
    if (!search) {
        res.status(400).json({ message: 'Search term is required' });
        return;
    }
    const cards = await cardService.getCardFromSearch(search);
    if (!cards) {
        res.status(404).json({ message: 'Card not found for the given search term' });
        return;
    }
    res.status(200).json(cards);
}

