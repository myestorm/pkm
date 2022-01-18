import { Schema, model } from 'mongoose'
import { IRecycleModelType } from '../../types/recycle'
import { docSchema } from './knowledge'
import dayjs from 'dayjs'

const schema = new Schema({
  title: {
    type: String,
    default: dayjs(new Date()).format('YYYY-MM')
  },
  children: [docSchema]
})

const RecycleModel = model<IRecycleModelType>('Recycle', schema)

export default RecycleModel
