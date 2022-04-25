import { defineStore } from 'pinia'
import { BookState } from './types'

import * as TypesBase from '@/types/base'
import * as TypesBook from '@/types/book'

import * as Apis from '@/apis/book'

const formDefault: TypesBook.IBookFormType = {
  _id: '',
  title: '',
  directory: [],
  type: TypesBase.IBaseTypesType.FILE,
  cover: '',
  desc: '',
  tags: [],
  author: '',
  readed: false,
  heard: false,
  purchased: false,
  ISBN: '',
  rating: 3
}

const bookDefault: TypesBook.IBookType = {
  ...formDefault,
  top: false,
  order: 99,
  notes: [],
  comments: [],
  createdAt: new Date(),
  createdBy: '',
  updatedAt: new Date(),
  updatedBy: ''
}

const useStore = defineStore('book', {
  state: (): BookState => ({
    currentId: '',
    directory: [],
    list: [],
    keyword: '',

    bookFormDrawerId: '',
    bookFormDrawerType: TypesBase.IBaseTypesType.FILE,
    bookFormDrawerVisible: false,
    
    clipboard: null,
    clipboardType: TypesBase.IClipboardType.NONE
  }),

  getters: {
    getFormDefault: () => {
      return {
        ...formDefault
      }
    },
    getBookDefault: () => {
      return {
        ...bookDefault
      }
    }
  },

  actions: {
    backTo () {
      let _directory = [...this.directory]
      _directory.pop()
      this.directory = [..._directory]
    },
    create (type: TypesBase.IBaseTypesType) {
      this.bookFormDrawerId = ''
      this.bookFormDrawerType = type
      this.bookFormDrawerVisible = true
    },
    edit (id: string) {
      this.bookFormDrawerId = id
      this.bookFormDrawerVisible = true
    },
    bookList (query: TypesBook.IBookQueryType) {
      return Apis.BookList(query)
    },
    bookRemove (id: string) {
      return Apis.BookRemove(id)
    },
    bookSearch (keyword: string, directory: string[]) {
      return Apis.BookSearch({
        keyword, 
        directory
      })
    },
    bookBreadcrumbs (ids: string[]) {
      return Apis.BookBreadcrumbs({
        ids
      })
    },
    bookMove (postData: { id: string, directory: string[] }) {
      return Apis.BookMove(postData)
    },
    bookCopy (postData: { id: string, directory: string[] }) {
      return Apis.BookCopy(postData)
    },
    bookOrder (postData: { id: string, order: number }) {
      return Apis.BookOrder(postData)
    },
    bookSubmit (postData: TypesBook.IBookFormType) {
      return Apis.BookAdd(postData)
    },
    bookInfo (id: string) {
      return Apis.BookInfo(id)
    },
    noteInfo (bookId: string, id: string) {
      return Apis.NoteInfo(bookId, id)
    },
    noteAdd (bookId: string, postData: TypesBook.INoteAddType) {
      return Apis.NoteAdd(bookId, postData)
    },
    noteUpdate (bookId: string, id: string, postData: TypesBook.INoteAddType) {
      return Apis.NoteUpdate(bookId, id, postData)
    },
    noteRemove (bookId: string, id: string) {
      return Apis.NoteRemove(bookId, id)
    }
  }
})
export default useStore
