import express from 'express';
import { signin, signup } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { checkDuplicateEmail } from '../middlewares/auth.js';
import { signinSchema, signupSchema } from '../validations/authValidation.js';

const router = express.Router();

router.post('/signin', validate(signinSchema), signin);
router.post('/signup', validate(signupSchema), checkDuplicateEmail, signup);

export default router;