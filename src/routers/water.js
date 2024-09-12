import express from "express";

import {
    createWaterController,
    getWaterByIdController,
    updateWaterController,
    deleteWaterController,
  } from '../controllers/water.js';
  import { ctrlWrapper } from '../utilts/ctrlWrapper.js';
  import { validateMongoId } from '../middlewares/validateMongoId.js';
  import { validateBody } from '../middlewares/validateBody.js';
  import { createWaterSchema, updateWaterSchema } from '../validation/water.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();


router.use(checkAuth);

router.post('/',  validateBody(createWaterSchema),  ctrlWrapper(createWaterController));
router.get('/:id', validateMongoId('id'), ctrlWrapper(getWaterByIdController));
router.patch('/:id', validateBody(updateWaterSchema),  validateMongoId('id'),  ctrlWrapper(updateWaterController));
router.delete( '/:id',  validateMongoId('id'),   ctrlWrapper(deleteWaterController));

export default router;
