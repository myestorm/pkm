import { Schema, model, now } from 'mongoose'
import * as TypesDocument  from '../types/document'

import { baseDef } from './base/base'
import commentSchema from './base/comment'

const schema = new Schema({
  ...baseDef,
  content: {
    type: String,
    default: ''
  },
  comments: [commentSchema],
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

schema.virtual('directoryList', {
  ref: 'Document',
  localField: 'directory',
  foreignField: '_id',
  justOne: false,
  count: false
})

schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

const DocumentModel = model<TypesDocument.IDocumentModelType>('Document', schema)

export default DocumentModel
