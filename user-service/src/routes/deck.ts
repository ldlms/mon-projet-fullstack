import { Router } from 'express';
import * as deckController from '../controller/Deck.ts';
import { authMiddleware } from '../middlewares/auth.ts';

const deckRouter = Router();

deckRouter.get("/all",authMiddleware, deckController.getDecks);

deckRouter.get("/:id", authMiddleware, deckController.getDeck);

deckRouter.post("/",authMiddleware, deckController.createDeck);

deckRouter.put("/:id",authMiddleware, deckController.updateDeck);

deckRouter.delete("/:id",authMiddleware, deckController.deleteDeck);

deckRouter.get("/:id", authMiddleware, deckController.getUserDecks);

deckRouter.delete("/:deck/:id", authMiddleware, deckController.removeCardFromDeck)

deckRouter.post("/:deck/:id",authMiddleware, deckController.addCardToDeck)

export default deckRouter;