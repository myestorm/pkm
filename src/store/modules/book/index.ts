import { defineStore } from 'pinia'
import { BookState, FormType } from './types'

const formDefault = {
  _id: '',
  title: '',
  author: '',
  cover: '',
  desc: '',
  readed: false,
  heard: false,
  purchased: false,
  ISBN: '',
  tags: [],
  rating: 3
}

const useStore = defineStore('book', {
  state: (): BookState => ({
    list: [],
    keyword: '',
    id: '',
    fileFormVisible: false,
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
    setFormDefault () {
      this.fileFormInitValue = {
        ...formDefault
      }
    },
    setFormValue (data: FormType) {
      this.fileFormInitValue = {
        ...data
      }
    }
  }
})
export default useStore
