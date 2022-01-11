import { Schema, model, now } from 'mongoose'
import { ISchemaAdminType, IAdminModelType } from '../../types/admin'

const schema = new Schema<ISchemaAdminType>({
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
}, {
  timestamps: { 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const AdminModel = model<IAdminModelType>('Admin', schema)

export default AdminModel
