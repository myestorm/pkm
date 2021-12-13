import Koa from 'koa'
import path from 'path'
import fs from 'fs'
import { Context, Next } from 'koa'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import mongoConfig from './.mongo.config'

import router from './routes/index'

const app = new Koa()
const uploadDir = '../resource/uploads'

mongoose.connect(mongoConfig)
mongoose.connection.on('error', console.error)

app.use(async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (err) {
    ctx.app.emit('error', err, ctx)
  }
})

const staticDir = path.join(__dirname, '../resource')
app.use(koaStatic(staticDir))

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, uploadDir),
    maxFields: 500,
    keepExtensions: true,
    maxFieldsSize: 5 * 1024 * 1024,
    onFileBegin (name, file) {
      // 设置上传位置
      const dirName = dayjs(new Date()).format('YYYYMMDD')
      const dir = path.join(__dirname, `${uploadDir}/${dirName}`)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      let fileName = path.parse(file.path).base
      fileName = fileName.replace(/^upload_/, '')
      file.name = fileName
      file.path = `${dir}/${fileName}`
    }
  },
  parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE']
}))

app.use(router.routes()).use(router.allowedMethods())

app.on('error', async (err, ctx) => {
  let status = ''
  let statusText = ''
  let body = {}
  if (err.response) {
    status = err.response.status
    statusText = err.response.statusText
    body = err.response.data || {}
  } else {
    status = err.statusCode || err.status || 500
    statusText = err.statusText || err.message || 'error'
    body = {
      code: status,
      msg: statusText
    }
  }
  ctx.status = status
  ctx.body = body
})

app.listen(4000, () => {
  console.log('application is running on port 4000')
})
