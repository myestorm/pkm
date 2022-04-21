import { Schema, model, now } from 'mongoose'
import { IDocumentModelType } from '../../types/document'
import * as BaseTypes from '../../types/base'

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
    default: BaseTypes.IBaseTypesType.FILE
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

const DocumentModel = model<IDocumentModelType>('Document', schema)

export default DocumentModel
