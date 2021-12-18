import { Schema, model, now } from 'mongoose'
import { IAdminUserType } from '../types/admin'

const schema = new Schema<IAdminUserType>({
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
  createdAt: {
    type: Date,
    default: now()
  },
  updatedAt: {
    type: Date,
    default: now()
  }
})

const AdminModel = model<IAdminUserType>('Admin', schema)

export default AdminModel
