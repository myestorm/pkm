import { Schema, model, now } from 'mongoose'
import * as TypesFile  from '../types/file'

const schema = new Schema({
  type: {
    type: String,
    default: ''
  },
  filepath: {
    type: String,
    default: ''
  },
  rootpath: {
    type: String,
    default: ''
  },
  base: {
    type: String,
    default: ''
  },
  ext: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
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
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const FileModel = model<TypesFile.IFileModelType>('File', schema)

export default FileModel
