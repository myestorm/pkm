import Router from '@koa/router'
import glob from 'glob'
import path from 'path'
const files = glob.sync(path.join(__dirname, '!(index).js'))

const router = new Router()

export default (options) => {
  if (options?.prefix) {
    router.prefix(options?.prefix)
  }
  for (const file of files) {
    const filePathData = path.parse(file)
    const fileName = filePathData.name === 'home' ? '' : '/' + filePathData.name
    const route = require(file)
    router.use(fileName, route.routes(), route.allowedMethods())
  }
  return router.routes()
}
