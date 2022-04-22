import { defineStore } from 'pinia'
import { DocumentState } from './types'

import * as TypesBase from '@/types/base'
import * as TypesDocument from '@/types/document'

import * as ApiDocument from '@/apis/document'

const formDefault: TypesDocument.IDocumentType = {
  _id: '',
  title: '',
  directory: [],
  type: TypesBase.IBaseTypesType.FILE,
  cover: '',
  desc: '',
  tags: [],
  top: false,
  order: 99,
  content: '',
  comments: [],
  createdAt: new Date(),
  createdBy: '',
  updatedAt: new Date(),
  updatedBy: ''
}

const useStore = defineStore('document', {
  state: (): DocumentState => ({
    directory: [],
    list: [],
    keyword: '',
    id: '',
    documentFormDrawerVisible: false
  }),

  getters: {
    getFormDefault: () => {
      return {
        ...formDefault
      }
    }
  },

  actions: {
    backTo () {
      let _directory = [...this.directory]
      _directory.pop()
      this.directory = [..._directory]
    },
    submitForm (postData: TypesDocument.IDocumentFileFormType) {
      return ApiDocument.DocumentForm(postData)
    },
    remove (id: string) {
      return ApiDocument.DocumentRemove(id)
    },
    search (keyword: string, directory?: string[]) {
      return ApiDocument.DocumentSearch(keyword, directory)
    },
    getList (postData: TypesDocument.IDocumentListType) {
      return ApiDocument.DocumentList(postData)
    },
    getInfo (id: string) {
      return ApiDocument.DocumentInfo(id)
    },
    move (postData: { id: string, directory: string[] }) {
      return ApiDocument.DocumentUpdateDirectory(postData)
    },
    order (postData: { id: string, order: number }) {
      return ApiDocument.DocumentUpdateOrder(postData)
    },
    saveContent (postData: { id: string, content: string }) {
      return ApiDocument.DocumentUpdateContent(postData)
    }
  }
})
export default useStore
