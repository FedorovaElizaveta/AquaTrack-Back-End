import { WaterCollection } from '../db/models/water.js';

export const createWater = async (payload) => {
    let { amount, date, userId, userNorm } = payload;
  
  
    const percentage = ((amount / (userNorm * 1000)) * 100).toFixed(2);
    const water = await WaterCollection.create({
      amount,
      date,
      percentage,
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
    userNorm,
    options = {},
  ) => {
    const water = await getWaterById(waterId, userId);
  
    if (!water) return null;
  
    const {
      amount = water.amount,
      date = water.date,
    } = payload;
  
    const percentage = ((amount / (userNorm * 1000)) * 100).toFixed(2);
  
    const rawResult = await WaterCollection.findOneAndUpdate(
      { _id: waterId, owner: userId },
      { amount, date, percentage },
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
  
    if (!rawResult || !rawResult.value) return null;
  

    return rawResult;
  };
  
  export const deleteWaterById = async (waterId, userId) => {
    const water = await WaterCollection.findOneAndDelete({
      _id: waterId,
      owner: userId,
    });
  
    if (!water) return null;
  
    return water;
  };