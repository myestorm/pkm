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
    currentId: '',
    currentType: 'view',
    directory: [],
    list: [],
    keyword: '',
    documentFormDrawerId: '',
    documentFormDrawerType: TypesBase.IBaseTypesType.FILE,
    documentFormDrawerVisible: false,
    clipboard: null,
    clipboardType: TypesBase.IClipboardType.NONE
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
    create (type: TypesBase.IBaseTypesType) {
      this.documentFormDrawerId = ''
      this.documentFormDrawerType = type
      this.documentFormDrawerVisible = true
    },
    edit (id: string) {
      this.documentFormDrawerId = id
      this.documentFormDrawerVisible = true
    },
    docSubmit (postData: TypesDocument.IDocumentFileFormType) {
      return ApiDocument.DocumentForm(postData)
    },
    docRemove (id: string) {
      return ApiDocument.DocumentRemove(id)
    },
    docSearch (keyword: string, directory?: string[]) {
      return ApiDocument.DocumentSearch(keyword, directory)
    },
    docList (postData: TypesDocument.IDocumentListType) {
      return ApiDocument.DocumentList(postData)
    },
    docInfo (id: string) {
      return ApiDocument.DocumentInfo(id)
    },
    docMove (postData: { id: string, directory: string[] }) {
      return ApiDocument.DocumentMove(postData)
    },
    docCopy (postData: { id: string, directory: string[] }) {
      return ApiDocument.DocumentCopy(postData)
    },
    docOrder (postData: { id: string, order: number }) {
      return ApiDocument.DocumentUpdateOrder(postData)
    },
    docBreadcrumbs (ids: string[]) {
      return ApiDocument.DocumentBreadcrumbs(ids)
    },
    docSaveContent (postData: { id: string, content: string }) {
      return ApiDocument.DocumentUpdateContent(postData)
    }
  }
})
export default useStore
