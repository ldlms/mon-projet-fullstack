
import { Router } from 'express';
import * as cardController from '../Controller/card.ts';


const cardRouter = Router();

cardRouter.get('/',cardController.getCardForDeck);

cardRouter.get("/deck",cardController.getCardFromColorForDeck);

cardRouter.get("/search",cardController.getCardFromSearch);

export default cardRouter;




