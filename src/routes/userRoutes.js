import { Router } from 'express';
import { signup, login } from '../controllers/userController.js';
import { signupValidator } from '../validators/userValidator.js';
import { validate } from '../validators/validate.js';

const router = Router();

router.post('/signup', signupValidator, validate, signup);
router.post('/login', login);

export default router;
