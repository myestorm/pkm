import { defineStore } from 'pinia'
import { DocumentState, FileFormType, FormType } from './types'

const formDefault = {
  _id: '',
  parents: [],
  title: '',
  type: FileFormType.DOC,
  authorId: '',
  cover: '',
  desc: '',
  content: '',
  tags: [],
  top: false
}

const useStore = defineStore('document', {
  state: (): DocumentState => ({
    parents: [],
    list: [],
    keyword: '',
    id: '',
    fileFormVisible: false,
    fileFormType: FileFormType.DOC,
    fileFormInitValue: {
      ...formDefault
    }
  }),

  getters: {
    getFormDefault: () => {
      return formDefault
    }
  },

  actions: {
    backTo () {
      let _parents = [...this.parents]
      _parents.pop()
      this.parents = [..._parents]
    },
    setFormDefault () {
      this.fileFormInitValue = {
        ...formDefault
      }
    },
    setFormValue (data: FormType) {
      this.fileFormInitValue = {
        ...data
      }
    },
    setTypeDoc () {
      this.fileFormType = FileFormType.DOC
    },
    setTypeFolder () {
      this.fileFormType = FileFormType.FOLDER
    }
  }
})
export default useStore
