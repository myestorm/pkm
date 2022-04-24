import BaseController from '../core/controller'
import Book from '../models/book'

import  * as TypesBook from '../types/book'

class BookController extends BaseController<TypesBook.IBookModelType> {

  constructor () {
    super(Book)
  }

  async search (keyword: string): Promise<TypesBook.IBookType[]> {
    const reg = new RegExp(keyword, 'gmi')

    const params = {
      $or: [
        { title: { $regex: reg } },
        { desc: { $regex: reg } },
        { tags: { $regex: reg } }
      ]
    }
    const list = await this.model.find(params, '_id title desc author cover').sort({
      _id: -1
    })
    list.sort(this.sortMethod)
    return list
  }

  async addNote (bookId: string, data: TypesBook.INoteAddType): Promise<TypesBook.INoteType | null> {
    const book = await this.model.findById(bookId)
    if (book) {
      book?.notes.unshift(data)
      await book?.save()
      return book?.notes[0] || null
    } else {
      return null
    }
  }

  async updateNote (bookId: string, noteId: string, data: TypesBook.INoteAddType): Promise<TypesBook.INoteType | null> {
    const book = await this.model.findById(bookId)
    let note = book?.notes.id(noteId)
    note = Object.assign(note, data)
    await book?.save()
    return note
  }

  async removeNote (bookId: string, noteId: string): Promise<TypesBook.INoteType | null> {
    const book = await this.model.findById(bookId)
    const note = book?.notes.id(noteId)
    note.remove()
    await book?.save()
    return note
  }

  async noteInfo (bookId: string, noteId: string): Promise<TypesBook.INoteType | null> {
    const book = await this.model.findById(bookId)
    const note = book?.notes.id(noteId)
    return note
  }

}

export default BookController
