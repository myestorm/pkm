import { Schema, HydratedDocument, Types, model } from 'mongoose'
import { IRecycleUpdateType } from '../types/recycle'
import { docSchema } from './knowledge'
import dayjs from 'dayjs'

type RecycleSchemaType = HydratedDocument<
  IRecycleUpdateType & {
    children: Types.Subdocument
  }
>

const schema = new Schema<IRecycleUpdateType>({
  title: {
    type: String,
    default: dayjs(new Date()).format('YYYY-MM')
  },
  children: [docSchema]
})

const RecycleModel = model<RecycleSchemaType>('Recycle', schema)

export default RecycleModel
