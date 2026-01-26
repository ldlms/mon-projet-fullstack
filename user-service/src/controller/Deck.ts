import * as deckService from "../services/deck.ts";
import type { Deck } from "../types/index.ts";
import type { Request, Response } from "express";

export const getDecks = async (req:Request, res:Response):Promise<void> => {
    const decks:Deck[] = await deckService.getAllDecks();
    res.json(decks);
};

export const getDeck = async (req:Request, res:Response):Promise<void> => {
    const deckid = req.params.id;
    if (!deckid) {
        res.status(400).json({ message: 'Deck ID is required' });
        return;
    }
    const deck:Deck | null = await deckService.getDeckById(deckid);
    if (!deck) {
        res.status(404).json({ message: 'Deck not found' });
        return;
    }       
    res.json(deck);
};

export const createDeck = async (req:Request, res:Response):Promise<void> => {
    const { name, format, ownerId, cards, commanderId } = req.body;
    const deck = await deckService.createDeck({ name, format, ownerId, cards, commanderId });
    res.status(201).json(deck);
};

export const updateDeck = async (req:Request, res:Response): Promise<void> => {
    const deckid = req.params.id;
    if (!deckid) {
        res.status(400).json({ message: 'Deck ID is required' });
        return;
    }
    const updated = await deckService.updateDeck(deckid, req.body);
    if (!updated) {
        res.status(404).json({ message: 'Deck not found' });
        return;
    }
    res.json(updated);
};

export const deleteDeck = async (req:Request, res:Response) => {
    const deckid = req.params.id;
    if (!deckid) {
        res.status(400).json({ message: 'Deck ID is required' });
        return;
    }
    const success = await deckService.deleteDeck(deckid);
    if (!success) {
        res.status(404).json({ message: 'Deck not found' });
        return;
    }
    res.status(204).send();
};

export const addCardToDeck = async (req:Request, res:Response) => {
    const { deckId, cardId } = req.params;
    if (!deckId) {
        res.status(400).json({ message: 'Deck ID is required' });
        return;
    }
    if (!cardId) {
        res.status(400).json({ message: 'Card ID is required' });
        return;
    }
    try{
    const updatedDeck = await deckService.addCardToDeck(deckId, cardId);
    res.json(updatedDeck);
    }catch(error){
       return res.status(404).json({ message: 'Deck not found' });
    }
};


export const removeCardFromDeck = async (req:Request, res:Response) => {
    const { deckId, cardId } = req.params;

    if (!deckId) {
        res.status(400).json({ message: 'Deck ID is required' });
        return;
    }
    if (!cardId) {
        res.status(400).json({ message: 'Card ID is required' });
        return;
    }
    try{
    const updatedDeck = await deckService.removeCardFromDeck(deckId, cardId);
    res.json(updatedDeck);
    }catch(error){
       return res.status(404).json({ message: 'Deck not found' });
    }
};

export const getUserDecks = async (req:Request, res:Response) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
    }
    const decks:Deck[] = await deckService.getDecksByUserId(userId);
    res.json(decks);
};