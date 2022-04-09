import { Schema, model, now } from 'mongoose'
import { IBookModelType } from '../../types/book'

export const noteSchema = new Schema({
  content: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: now()
  },
  createdBy: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: now()
  },
  updatedBy: {
    type: String,
    default: ''
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

export const schema = new Schema({
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
  heard: { // 已听
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
  notes: [noteSchema],
  createdAt: {
    type: Date,
    default: now()
  },
  createdBy: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: now()
  },
  updatedBy: {
    type: String,
    default: ''
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const BookModel = model<IBookModelType>('Book', schema)

export default BookModel
