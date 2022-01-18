import Bookrack from '../models/bookrack'
import {
  IBookrackGroupType,
  IBookType,
  IControllerBookrackGroupAddType,
  IControllerBookAddType,
  INoteType,
  IControllerNoteAddType
} from '../../types/bookrack'

import BaseController from '../core/controller'

class BookrackController extends BaseController {

  async list (): Promise<IBookrackGroupType[]> {
    const list = await Bookrack.find({}).sort({
      _id: -1
    })
    return list
  }

  async add (data: IControllerBookrackGroupAddType): Promise<IBookrackGroupType> {
    return await Bookrack.create(data)
  }

  async update (id: string, data: IControllerBookrackGroupAddType): Promise<IBookrackGroupType | null> {
    return await Bookrack.findByIdAndUpdate(id, data, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async remove (id: string): Promise<IBookrackGroupType | null> {
    return await Bookrack.findByIdAndRemove(id)
  }

  async info (id: string, hasChildren: boolean = false): Promise<IBookrackGroupType | null> {
    const opts = hasChildren ? {} : {
      children: 0
    }
    return await Bookrack.findById(id, opts)
  }

  async addBook (gid: string, data: IControllerBookAddType): Promise<IBookType | null> {
    const parent = await Bookrack.findById(gid)
    parent?.children.unshift(data)
    await parent?.save()
    return parent?.children[0] || null
  }

  async infoBook (gid: string, id: string): Promise<IBookType | null> {
    const parent = await Bookrack.findById(gid)
    const sub = parent?.children.id(id)
    return sub
  }

  async updateBook (gid: string, id: string, data: IControllerBookAddType): Promise<IBookType | null> {
    const parent = await Bookrack.findById(gid)
    let sub = parent?.children.id(id)
    sub = Object.assign(sub, data)
    await parent?.save()
    return sub
  }

  async removeBook (gid: string, id: string): Promise<IBookType | null> {
    const parent = await Bookrack.findById(gid)
    const sub = parent?.children.id(id)
    sub.remove()
    await parent?.save()
    return sub
  }

  async addNote (gid: string, bid: string, data: IControllerNoteAddType): Promise<INoteType | null> {
    const parent = await Bookrack.findById(gid)
    const book = parent?.children.id(bid)
    if (book) {
      book?.children.unshift(data)
      await parent?.save()
      return book?.children[0] || null
    } else {
      return null
    }
  }

  async updateNote (gid: string, bid: string, id: string, data: IControllerNoteAddType): Promise<INoteType | null> {
    const parent = await Bookrack.findById(gid)
    const book = parent?.children.id(bid)
    let note = book?.children.id(id)
    note = Object.assign(note, data)
    await parent?.save()
    return note
  }

  async removeNote (gid: string, bid: string, id: string): Promise<INoteType | null> {
    const parent = await Bookrack.findById(gid)
    const book = parent?.children.id(bid)
    const note = book?.children.id(id)
    note.remove()
    await parent?.save()
    return note
  }
}

export default BookrackController
