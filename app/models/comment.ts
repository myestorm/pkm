import { Schema, now } from 'mongoose'

const commentSchema = new Schema({
  title: {
    type: String,
    default: ''
  },
  replyId: {
    type: String,
    default: ''
  },
  authorId: {
    type: String,
    default: ''
  },
  content: {
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
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})
export default commentSchema
