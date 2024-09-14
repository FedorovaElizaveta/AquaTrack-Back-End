import { WaterCollection } from '../db/models/water.js';

export const createWater = async (payload) => {
    let { amount, date, userId } = payload;
  
  
    const water = await WaterCollection.create({
      amount,
      date,
      owner: userId,
    });
  
    const { _id, ...other } = water._doc;
    const data = { id: _id, ...other };
    return data;
  };

  
  export const getWaterById = async (waterId, userId) => {
    const water = await WaterCollection.findOne({
      _id: waterId,
      owner: userId,
    });
  
    if (!water) return null;
  
    const { _id, ...other } = water._doc;
    const data = { id: _id, ...other };
    return data;
  };

  export const updateWaterById = async (
    waterId,
    userId,
    payload,
    options = {},
  ) => {
    const water = await getWaterById(waterId, userId);
  
    if (!water) return null;
  
    const {
      amount = water.amount,
      date = water.date,
      norm = water.norm,
    } = payload;
  
    const percentage = ((amount / (norm * 1000)) * 100).toFixed(2);
  
    const rawResult = await WaterCollection.findOneAndUpdate(
      { _id: waterId, owner: userId },
      { amount, date, norm, percentage },
      {
        new: true,
        includeResultMetadata: true,
        ...options,
      },
    );
  
    if (!rawResult || !rawResult.value) return null;
  
    const { _id, ...other } = rawResult.value._doc;
    const data = { id: _id, ...other };
    return data;
  };
  
  export const deleteWaterById = async (waterId, userId) => {
    const water = await WaterCollection.findOneAndDelete({
      _id: waterId,
      owner: userId,
    });
  
    if (!water) return null;
  
    const { _id, ...other } = water._doc;
    const data = { id: _id, ...other };
    return data;
  };