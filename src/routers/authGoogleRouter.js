import { Router } from 'express';

import {
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/authGoogleController.js';
import { loginWithGoogleOAuthSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utilts/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.get('/oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

export default router;
