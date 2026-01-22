import * as cardService from "../service/cardService.ts";
import type { Request, Response } from "express";
import type { Color } from "../prisma/browser.ts";


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

export const getCardFromColorForDeck = async (req:Request, res:Response) => {
    const deckColor  = req.body ?.deckColor as Color[];
    if (!deckColor) {
        res.status(400).json({ message: 'Deck Color is required' });
        return;
    }   
    const cards = await cardService.getCardFromColorForDeck(deckColor);
    if (!cards) {
        res.status(404).json({ message: 'Card not found for the given Deck Color' });
        return;
    }
    res.status(200).json(cards);
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

