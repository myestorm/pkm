import { Schema, HydratedDocument, Types, model, now } from 'mongoose'
import { IKnowledgeUpdateType, IKnowledgeDocType } from '../types/knowledge'

type KnowledgeSchemaType = HydratedDocument<
  IKnowledgeUpdateType & {
    children: Types.Subdocument
  }
>

export const docSchema = new Schema<IKnowledgeDocType>({
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
  tags: []
})

const schema = new Schema<IKnowledgeUpdateType>({
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
  children: [docSchema]
})

const KnowledgeModel = model<KnowledgeSchemaType>('Knowledge', schema)

export default KnowledgeModel
