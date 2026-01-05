import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { registerValidation, loginValidation } from '../utils/validation';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router: Router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerValidation),
  AuthController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginValidation),
  AuthController.login
);

router.get('/me', authenticate, AuthController.getMe);

router.post('/logout', authenticate, AuthController.logout);

export default router;

