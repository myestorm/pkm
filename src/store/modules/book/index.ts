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
    submit (postData: TypesBook.IBookFormType) {
      return Apis.BookAdd(postData)
    },
    info (id: string) {
      return Apis.BookInfo(id)
    },
  }
})
export default useStore
