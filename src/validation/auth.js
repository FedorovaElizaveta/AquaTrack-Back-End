import Joi from 'joi';

export const registerLoginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});

export const patchUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  gender: Joi.string().valid('woman', 'man'),
  weight: Joi.number(),
  sportTime: Joi.number(),
  dailyWater: Joi.number(),
  avatar: Joi.any().optional(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
