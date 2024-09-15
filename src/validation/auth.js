import Joi from 'joi';

export const registerLoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const patchUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  gender: Joi.string().valid('woman', 'man'),
  weight: Joi.number(),
  sportTime: Joi.number(),
  dailyWater: Joi.number(),
  // avatar: Joi.any().optional(),
});
