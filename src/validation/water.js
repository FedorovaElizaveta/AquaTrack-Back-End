import Joi from 'joi';

export const createWaterSchema = Joi.object({
  amount: Joi.number().integer().required().example(50).messages({
    'number.base': 'The amount of water should be a number.',
    'number.integer': 'The amount of water should be a whole number.',
    'any.required': 'The amount of water is mandatory for filling.',
  }),
  date: Joi.date().iso().required().example('YYYY-MM-DD').messages({
    'string.base': 'The date should be a line.',
    'any.required': 'The date is required to be filled in.',
  }),
  norm: Joi.number().example(1.8).messages({
    'number.base': 'The norm should be a number.',
  }),
});

export const updateWaterSchema = Joi.object({
  amount: Joi.number().integer().example(50).messages({
    'number.base': 'The amount of water should be a number.',
    'number.integer': 'The amount of water should be a whole number.',
  }),
  date: Joi.date().iso().required().example('YYYY-MM-DD').messages({
    'string.base': 'The date should be a line.',
    'any.required': 'The date is required to be filled in.',
  }),
  norm: Joi.number().example(1.8).messages({
    'number.base': 'The norm should be a number.',
  }),
})
  .min(1)
  .messages({
    'object.min': 'You must specify at least one field to update.',
  });
