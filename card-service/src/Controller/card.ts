import * as cardService from "../service/cardService.ts";
import type { Request, Response } from "express";
import type { Card } from "../type";


export const getCardForDeck = async (req:Request, res:Response) => {
    const deckCards  = req.body ?.deckCards as string[];
    if (!deckCards) {
        res.status(400).json({ message: 'Deck Cards is required' });
        return;
    }
    const card:Card[]|null = await cardService.getCardForDeck(deckCards);
    if (!card) {
        res.status(404).json({ message: 'Card not found for the given Deck ID' });
        return;
    }

    res.status(200).json(card);
}