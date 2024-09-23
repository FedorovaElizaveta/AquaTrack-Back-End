import { WaterCollection } from '../db/models/water.js';

export const createWater = async (payload) => {
  let { amount, date, userId } = payload;

  const water = await WaterCollection.create({
    amount,
    date: new Date(date),
    owner: userId,
  });

  return water;
};

export const getWaterById = async (waterId, userId) => {
  const water = await WaterCollection.findOne({
    _id: waterId,
    owner: userId,
  });

  if (!water) return null;

  return water;
};

export const updateWaterById = async (
  waterId,
  userId,
  payload,
  options = {},
) => {
  const water = await getWaterById(waterId, userId);

  if (!water) return null;

  const { amount = water.amount, date = water.date } = payload;

  const updatedDate = date ? new Date(date) : water.date;

  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id: waterId, owner: userId },
    { amount, date: updatedDate },
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteWaterById = async (waterId, userId) => {
  const water = await WaterCollection.findOneAndDelete({
    _id: waterId,
    owner: userId,
  });

  if (!water) return null;

  return water;
};

export const getWaterPerDay = async ({ userId, date }) => {
  const startOfDay = new Date(`${date}T00:00:00Z`);
  const endOfDay = new Date(`${date}T23:59:59Z`);

  const waterRecords = await WaterCollection.find({
    owner: userId,
    date: { $gte: startOfDay, $lt: endOfDay },
  });

  return waterRecords;
};

export const getWaterPerMonth = async ({ userId, date }) => {
  const startOfMonth = new Date(`${date}-01T00:00:00Z`);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const waterRecords = await WaterCollection.find({
    owner: userId,
    date: { $gte: startOfMonth, $lt: endOfMonth },
  });

  const dailyWater = {};

  waterRecords.forEach((record) => {
    const recordDate = new Date(record.date);
    const day = recordDate.getUTCDate();

    if (!dailyWater[day]) {
      dailyWater[day] = 0;
    }

    dailyWater[day] += record.amount;
  });

  const result = Object.keys(dailyWater).map((day) => ({
    [day]: dailyWater[day] || 0,
  }));

  return result;
};
