import { Schema, model, now } from 'mongoose'
import { IBookrackModelType } from '../../types/bookrack'

export const noteSchema = new Schema({
  content: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 99
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

export const bookrackSchema = new Schema({
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
  order: {
    type: Number,
    default: 99
  },
  children: [noteSchema],
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

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 99
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

const BookrackModel = model<IBookrackModelType>('Bookrack', schema)

export default BookrackModel
