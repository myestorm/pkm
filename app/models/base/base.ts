import { now } from 'mongoose'
import * as TypesBase from '../../types/base'

export const baseDef = {
  title: {
    type: String,
    required: true
  },
  directory: { // 父级目录
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
  createdAt: {
    type: Date,
    default: now()
  },
  createdBy: {
    type: String,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: now()
  },
  updatedBy: {
    type: String,
    default: ''
  }
}
