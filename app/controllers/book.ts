import BaseController from '../core/controller'
import Book from '../models/book'

import  * as TypesBook from '../types/book'

class BookController extends BaseController<TypesBook.IBookModelType> {

  constructor () {
    super(Book)
  }

  async copyBook (id: string, directory: string[] = []): Promise<boolean> {
    const result = this.copy(id, directory, (data: TypesBook.IBookType) => {
      const _data = this.methods.clearUnnecessaryFields(data, ['_id', 'title', 'directory', 'type', 'cover', 'desc', 'tags', 'top', 'order', 'comments', 'notes', 'author', 'readed', 'heard', 'purchased', 'ISBN', 'rating'])
      return _data
    })
    return result
  }

  async addNote (bookId: string, data: TypesBook.INoteCreateType): Promise<TypesBook.INoteType | null> {
    const book = await this.model.findById(bookId)
    if (book) {
      book?.notes.unshift(data)
      await book?.save()
      return book?.notes[0] || null
    } else {
      return null
    }
  }

  async updateNote (bookId: string, noteId: string, data: TypesBook.INoteCreateType): Promise<TypesBook.INoteType | null> {
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
