import { Schema, model, now } from 'mongoose'
import {
  ISchemaDocType,
  ISchemaKnowledgeType,
  IBookrackModelType
} from '../../types/knowledge'

export const docSchema = new Schema<ISchemaDocType>({
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
  publishAt: {
    type: Date,
    default: now()
  },
  thumb: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  tags: [],
  order: {
    type: Number,
    default: 99
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const schema = new Schema<ISchemaKnowledgeType>({
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
  thumb: {
    type: String,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  children: [docSchema],
  order: {
    type: Number,
    default: 99
  }
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const KnowledgeModel = model<IBookrackModelType>('Knowledge', schema)

export default KnowledgeModel
