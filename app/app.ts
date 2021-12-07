import Koa from 'koa'
import path from 'path'
import { Context, Next } from 'koa'
import koaStatic from 'koa-static'
import koaBody from 'koa-body'
import mongoose from 'mongoose'

import router from './routes/index'

const app = new Koa()

mongoose.connect(`mongodb://mylife:${encodeURIComponent('mylife!@#$%12345')}@localhost:27017/pkm`)
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
    uploadDir: path.join(__dirname, '../resource/uploads'),
    maxFields: 500,
    keepExtensions: true,
    maxFieldsSize: 5 * 1024 * 1024
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
