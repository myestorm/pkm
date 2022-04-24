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

const DocumentModel = model<TypesDocument.IDocumentModelType>('Document', schema)

export default DocumentModel
