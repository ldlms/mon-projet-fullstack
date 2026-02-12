// auth.ts - Routes for authentication endpoints
// Connects HTTP endpoints to authentication controller logic
// Includes OpenAPI (Swagger) comments for API documentation

import { Router } from 'express';
import { signup, login, logout } from '../controller/authController.ts';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;