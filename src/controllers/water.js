import createHttpError from 'http-errors';

import {
  createWater,
  getWaterById,
  updateWaterById,
  deleteWaterById,
  getWaterPerDay,
  getWaterPerMonth,
} from '../services/water.js';

export const createWaterController = async (req, res) => {
  const data = {
    ...req.body,
    userId: req.user._id,
  };

  const water = await createWater(data);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a water!',
    data: water,
  });
};

export const getWaterByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const water = await getWaterById(id, userId);

  if (!water) {
    next(createHttpError(404, 'Water record not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found water with id ${id}!`,
    data: water,
  });
};

export const updateWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const data = { ...req.body };

  const result = await updateWaterById(id, userId, data);

  if (!result) {
    next(createHttpError(404, 'Water not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a water record!',
    data: result,
  });
};

export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const water = await deleteWaterById(id, userId);

  if (!water) {
    next(createHttpError(404, 'Water not found'));
    return;
  }

  res.status(204).end();
};

export const getWaterPerDayController = async (req, res, next) => {
  const userId = req.user._id;
  const { date } = req.params;

  const water = await getWaterPerDay({
    userId,
    date,
  });

  if (!water || water.length === 0) {
    next(createHttpError(404, 'Water records not found'));
    return;
  }

  res.status(200).json({
    status: '200',
    message: 'Successfully found water records!',
    data: water,
  });
};

export const getWaterPerMonthController = async (req, res, next) => {
  const userId = req.user._id;
  const { date } = req.params;

  const water = await getWaterPerMonth({
    userId,
    date,
  });

  if (!water || water.length === 0) {
    next(createHttpError(404, 'Water records not found'));
    return;
  }

  res.status(200).json({
    status: '200',
    message: 'Successfully found water records!',
    data: water,
  });
};
