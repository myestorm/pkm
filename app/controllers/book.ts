import BaseController from '../core/controller'
import Book from '../models/book'
import  * as TypesBook from '../../types/book'
import { IResponePageBodyType } from '../../types/index'

const sortMethod = (a: TypesBook.IBookDataType, b: TypesBook.IBookDataType): number => {
  const _a = a.title.charCodeAt(0)
  const _b = b.title.charCodeAt(0)
  return _a - _b > 0 ? 1 : -1
}

class BookController extends BaseController {

  async add (data: TypesBook.IBookAddType): Promise<TypesBook.IBookDataType> {
    return await Book.create(data)
  }

  async update (data: TypesBook.IBookUpdateType): Promise<TypesBook.IBookDataType | null> {
    return await Book.findByIdAndUpdate(data._id, data, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async remove (id: string): Promise<TypesBook.IBookDataType | null> {
    return await Book.findByIdAndRemove(id)
  }

  async info (id: string): Promise<TypesBook.IBookDataType | null> {
    return await Book.findById(id)
  }

  async list (): Promise<TypesBook.IBookDataType[]> {
    const list = await Book.find().sort({
      _id: -1
    })
    list.sort(sortMethod)
    return list
  }

  async listPage (page: number, pagesize: number): Promise<IResponePageBodyType<TypesBook.IBookDataType>> {
    const start = (page - 1) * pagesize
    const total = await Book.find().count()
    const list: TypesBook.IBookDataType[] = await Book.find().skip(start).limit(pagesize).sort({
      _id: -1
    })
    list.sort(sortMethod)
    const res = {
      list,
      page,
      pagesize,
      total
    }
    return res
  }

  async search (keyword: string): Promise<TypesBook.IBookDataType[]> {
    const reg = new RegExp(keyword, 'gmi')

    const params = {
      $or: [
        { title: { $regex: reg } },
        { desc: { $regex: reg } },
        { tags: { $regex: reg } }
      ]
    }
    const list = await Book.find(params, '_id title desc author cover').sort({
      _id: -1
    })
    list.sort(sortMethod)
    return list
  }

  async addNote (bookId: string, data: TypesBook.INoteControlAddType): Promise<TypesBook.INoteControlReurnType | null> {
    const book = await Book.findById(bookId)
    if (book) {
      book?.notes.unshift(data)
      await book?.save()
      return book?.notes[0] || null
    } else {
      return null
    }
  }

  async updateNote (bookId: string, noteId: string, data: TypesBook.INoteControlAddType): Promise<TypesBook.INoteControlReurnType | null> {
    const book = await Book.findById(bookId)
    let note = book?.notes.id(noteId)
    note = Object.assign(note, data)
    await book?.save()
    return note
  }

  async removeNote (bookId: string, noteId: string): Promise<TypesBook.INoteControlReurnType | null> {
    const book = await Book.findById(bookId)
    const note = book?.notes.id(noteId)
    note.remove()
    await book?.save()
    return note
  }

  async noteInfo (bookId: string, noteId: string): Promise<TypesBook.INoteControlReurnType | null> {
    const book = await Book.findById(bookId)
    const note = book?.notes.id(noteId)
    return note
  }

}

export default BookController
