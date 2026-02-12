
import { Router } from 'express';
import * as cardController from '../Controller/cardController.ts';


const cardRouter = Router();

cardRouter.get("/deckColors",cardController.getCardFromColorForDeck);

cardRouter.get('/:id', cardController.getCardById);

cardRouter.get('/',cardController.getCardForDeck);

cardRouter.get("/search",cardController.getCardFromSearch);

export default cardRouter;




