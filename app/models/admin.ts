import { Schema, model, now } from 'mongoose'
import { IAdminUserType } from '../types/admin'

const schema = new Schema<IAdminUserType>({
  username: {
    type: String
  },
  password: {
    type: String
  },
  avatar: {
    type: String,
    default: ''
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
