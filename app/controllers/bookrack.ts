import Bookrack from '../models/bookrack'
import { IBookrackGroupType, IBookrackType } from '../types/bookrack'

import BaseController from '../core/controller'

type IBookrackGroupUpdateType = Omit<IBookrackGroupType, '_id' | 'children'>
type IBookrackGroupUpdateReturnType = Omit<IBookrackGroupType, '_id'>

const updateOption = { 
  new: true, 
  upsert: true,
  setDefaultsOnInsert: true,
  runValidators: true, 
  findByIdAndUpdate: 'after' 
}

class BookrackController extends BaseController {

  async list (): Promise<IBookrackGroupType[]> {
    return await Bookrack.find({}, {
      children: 0
    }).sort({
      _id: -1
    })
  }

  async add (data: IBookrackGroupUpdateType): Promise<IBookrackGroupUpdateReturnType> {
    return await new Bookrack(data).save()
  }

  async update (id: string, data: IBookrackGroupUpdateType): Promise<IBookrackGroupUpdateReturnType | null> {
    return await Bookrack.findByIdAndUpdate(id, data, updateOption)
  }

  async remove (id: string): Promise<IBookrackGroupUpdateReturnType | null> {
    return await Bookrack.findByIdAndRemove(id)
  }

  async info (id: string, hasChildren: boolean = false): Promise<IBookrackGroupType | null> {
    const opts = hasChildren ? {} : {
      children: 0
    }
    return await Bookrack.findById(id, opts)
  }

  async addBook (id: string, data: IBookrackType): Promise<IBookrackType> {
    const parent = await Bookrack.findById(id)
    parent?.children.unshift(data)
    await parent?.save()
    return parent?.children[0] || null
  }

  async updateBook (id: string, did: string, data: IBookrackType): Promise<IBookrackType | null> {
    const parent = await Bookrack.findById(id)
    let sub = parent?.children.id(did)
    sub = Object.assign(sub, data)
    await parent?.save()
    return sub
  }

  async removeBook (id: string, did: string): Promise<IBookrackType | null> {
    const parent = await Bookrack.findById(id)
    const sub = parent?.children.id(did)
    sub.remove()
    await parent?.save()
    return sub
  }
}

export default BookrackController
