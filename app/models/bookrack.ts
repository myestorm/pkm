import { Schema, HydratedDocument, Types, model, now } from 'mongoose'
import { IBookrackGroupType, IBookrackType } from '../types/bookrack'

type BookrackGroupSchemaType = HydratedDocument<
  Omit<IBookrackGroupType, '_id'> & {
    children: Types.Subdocument
  }
>

export const bookrackSchema = new Schema<Omit<IBookrackType, '_id'>>({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  readed: { // 已读
    type: Boolean,
    default: false
  },
  purchased: { // 已买
    type: Boolean,
    default: false
  },
  ISBN: {
    type: String,
    default: ''
  },
  tags: [],
  rating: { // 喜欢程度 1 看不懂 2 一般 3 喜欢 4 很喜欢 5 超爱
    type: Number,
    default: 3
  },
  createdAt: {
    type: Date,
    default: now()
  },
  updatedAt: {
    type: Date,
    default: now()
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const schema = new Schema<Omit<IBookrackGroupType, '_id'>>({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: now()
  },
  updatedAt: {
    type: Date,
    default: now()
  },
  children: [bookrackSchema]
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const BookrackModel = model<BookrackGroupSchemaType>('Bookrack', schema)

export default BookrackModel
