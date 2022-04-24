import { Schema, model, now } from 'mongoose'
import * as TypesAdmin from '../types/admin'

const schema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  avatar: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  nickname: {
    type: String,
    default: ''
  },
  root: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 1
  },
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

const AdminModel = model<TypesAdmin.IAdminModelType>('Admin', schema)

export default AdminModel
