import * as yup from 'yup'

import { Gender } from '~/data/__generated__'

const inventoryItemSchema = yup.object({
  item_id: yup.number().required(),
  quantity: yup.number().integer().required()
})

export const createSurvivorSchema = yup
  .object({
    name: yup.string().required(),
    age: yup
      .number()
      .typeError('age must be a number')
      .positive()
      .integer()
      .required(),
    gender: yup
      .string()
      .oneOf<Gender>(['male', 'female', 'other'])
      .required(),
    latitude: yup
      .number()
      .typeError('latitude must be a number')
      .required(),
    longitude: yup
      .number()
      .typeError('longitude must be a number')
      .required(),
    inventory: yup.array().of(inventoryItemSchema).required()
  })
  .required()
