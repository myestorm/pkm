import dayjs from 'dayjs'
import { App } from 'vue'

export default {
  install: (app: App) => {
    Object.defineProperties(app.config.globalProperties, {
      $formatDay: {
        get () {
          return (monment: Date): string => {
            return dayjs(monment).format('YYYY-MM-DD')
          }
        }
      },
      $formatTime: {
        get () {
          return (monment: Date): string => {
            return dayjs(monment).format('YYYY-MM-DD HH:mm:ss')
          }
        }
      },
      $dayjs: {
        get () {
          return dayjs
        }
      }
    })
  }
}
