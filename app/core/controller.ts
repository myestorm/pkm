import { Types } from 'mongoose'
import dayjs from 'dayjs'
import * as TypesBase from '../../types/base'

class BaseController {
  dayjs = dayjs

  updateOption = { 
    new: true, 
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true, 
    findByIdAndUpdate: 'after' 
  }

  createObjectId = () => {
    return new Types.ObjectId()
  }

  sortMethod = (a: TypesBase.IBaseFieldsObjectIdType, b: TypesBase.IBaseFieldsObjectIdType): 1 | -1 => {
    if (a.type === b.type) {
      if (a.order === b.order) {
        const _a = a.title.charCodeAt(0)
        const _b = b.title.charCodeAt(0)
        return _a - _b > 0 ? 1 : -1
      } else {
        return a.order > b.order ? 1 : -1
      }
    } else {
      return a.type === TypesBase.IBaseTypesType.FILE ? 1 : -1
    }
  }

}
export default BaseController
