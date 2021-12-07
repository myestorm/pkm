import { Schema, model, now } from 'mongoose'
import { IKnowledgeDocType, IKnowledgeType } from '../types/knowledge'


const schema = new Schema<IKnowledgeType>({
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
  thumb: {
    type: String,
    default: ''
  }
})

const KnowledgeModel = model<IKnowledgeType>('Knowledge', schema)

export default KnowledgeModel
