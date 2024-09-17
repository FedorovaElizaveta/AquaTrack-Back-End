import express from 'express';

import {
  createWaterController,
  getWaterByIdController,
  updateWaterController,
  deleteWaterController,
  getWaterPerDayController,
} from '../controllers/water.js';
import { ctrlWrapper } from '../utilts/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import { auth } from '../middlewares/auth.js';
import { isValidDate } from '../validation/isValidDate.js';
const router = express.Router();
const jsonParser = express.json();

router.use(auth);

router.post(
  '/',
  jsonParser,
  validateBody(createWaterSchema),
  ctrlWrapper(createWaterController),
);
router.get('/:id', isValidId, ctrlWrapper(getWaterByIdController));
router.patch(
  '/:id',
  jsonParser,
  validateBody(updateWaterSchema),
  isValidId,
  ctrlWrapper(updateWaterController),
);
router.delete('/:id', isValidId, ctrlWrapper(deleteWaterController));

router.get(
  '/per-day/:date',
  isValidDate,
  ctrlWrapper(getWaterPerDayController),
);

export default router;
