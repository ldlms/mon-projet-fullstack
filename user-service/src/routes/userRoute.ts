// user.ts - Routes for user resource endpoints
// Connects HTTP endpoints to user controller logic
// Uses authentication middleware for protected routes
// Includes OpenAPI (Swagger) comments for API documentation

import { Router } from 'express';
import * as userController from '../controller/userController.ts';
import { authMiddleware } from '../middlewares/auth.ts';

const userRouter = Router();

userRouter.get('/:id', authMiddleware, userController.getUser);

userRouter.get('/all', authMiddleware, userController.getUsers);

userRouter.put('/:id', authMiddleware, userController.updateUser);

userRouter.delete('/:id', authMiddleware, userController.deleteUser);

export default userRouter;