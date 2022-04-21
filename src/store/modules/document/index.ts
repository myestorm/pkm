import { defineStore } from 'pinia'
import { DocumentState, FileFormType, FormType } from './types'

const formDefault = {
  _id: '',
  directory: [],
  title: '',
  type: FileFormType.FILE,
  authorId: '',
  cover: '',
  desc: '',
  content: '',
  tags: [],
  top: false,
  order: 99
}

const useStore = defineStore('document', {
  state: (): DocumentState => ({
    directory: [],
    list: [],
    keyword: '',
    id: '',
    fileFormVisible: false,
    fileFormType: FileFormType.FILE,
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
      let _directory = [...this.directory]
      _directory.pop()
      this.directory = [..._directory]
    },
    setFormDefault () {
      this.fileFormInitValue = {
        ...formDefault,
        type: this.fileFormType,
        directory: this.directory
      }
    },
    setFormValue (data: FormType) {
      this.fileFormInitValue = {
        ...data
      }
    },
    setTypeDoc () {
      this.fileFormType = FileFormType.FILE
    },
    setTypeFolder () {
      this.fileFormType = FileFormType.FOLDER
    }
  }
})
export default useStore
