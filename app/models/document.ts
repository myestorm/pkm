import { Schema, model, now } from 'mongoose'
import commentSchema from './comment'
import { IDocumentModelType, IDocumentTypeType } from '../../types/document'

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  parents: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    default: IDocumentTypeType.DOC
  },
  authorId: {
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
  content: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  top: {
    type: Boolean,
    default: false
  },
  comments: [commentSchema],
  createdBy: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: now()
  },
  updatedBy: {
    type: String,
    default: ''
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

const DocumentModel = model<IDocumentModelType>('Document', schema)

export default DocumentModel
