import { Schema, model, now } from 'mongoose'
import * as TypesBase from '../types/base'
import * as TypesDocument  from '../types/document'

import commentSchema from './comment'

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  directory: {
    type: [String],
    default: []
  },
  type: {
    type: String,
    default: TypesBase.IBaseTypesType.FILE
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
  order: {
    type: Number,
    default: 99
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

const DocumentModel = model<TypesDocument.IDocumentModelType>('Document', schema)

export default DocumentModel
