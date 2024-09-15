import express from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utilts/ctrlWrapper.js';

import {
  registerUserController,
  loginUserController,
  logoutController,
  refreshTokensController,
  patchUserController,
  getUserInfoController,
} from '../controllers/auth.js';
import {
  registerLoginUserSchema,
  patchUserSchema,
} from '../validation/auth.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerLoginUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(registerLoginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutController));

router.post('/refresh', ctrlWrapper(refreshTokensController));

router.patch(
  '/profile',
  auth,
  jsonParser,
  upload.single('avatar'),
  validateBody(patchUserSchema),
  ctrlWrapper(patchUserController),
);

router.get('/info', auth, ctrlWrapper(getUserInfoController));

export default router;
