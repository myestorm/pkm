import { Context, Next } from 'koa'
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import dayjs from 'dayjs'
import getRootDir from '../utils/getRootDir'

import { prefix, get, post } from '../core/router'
// import ejs from 'ejs'
import * as TypesBase from '../types/base'
import Document from '../controllers/document'
import Book from '../controllers/book'
import Admin from '../controllers/Admin'

const document = new Document()
const book = new Book()
const admin = new Admin()

const rootDir = getRootDir()

@prefix('')
export default class Home {

  @get('/')
  async Index (ctx: Context, next: Next) {
    // const filePath = path.join(__dirname, '../../dist/index.html')
    // const template = ejs.fileLoader(filePath).toString()
    // const html = ejs.render(template, {})
    // ctx.body = html
    ctx.redirect('/index.html')
    await next()
  }

  // 搜素全部
  @get('/api/search/:keyword')
  async Search (ctx: Context, next: Next) {
    const { keyword = '' } = ctx.params
    const documents = await document.search(keyword, [])
    const books = await book.search(keyword, [])
    const result = {
      documents,
      books
    }
    const body: TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  // 最新资源
  @get('/api/recent')
  async Recent (ctx: Context, next: Next) {
    const documents = await document.listPage(1, 6, { type: TypesBase.IBaseTypesType.FILE })
    const books = await book.listPage(1, 9, { type: TypesBase.IBaseTypesType.FILE })
    const result = {
      documents: documents.list,
      books: books.list
    }
    const body: TypesBase.IResponeBodyType<TypesBase.ISearchAllDataType> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  // 推荐
  @get('/api/:type/top/:id/:status')
  async Top (ctx: Context, next: Next) {
    const { type = '', id = '', status } = ctx.params
    const top = (status === 'true' || status === true)
    if (type === 'document') {
      await document.updateById(id, { top })
    } else if (type === 'book') {
      await book.updateById(id, { top })
    }
    const body: TypesBase.IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: id
    }
    ctx.body = body
    await next()
  }

  // 备份
  @get('/api/bak')
  async Bak (ctx: Context, next: Next) {
    const folder = dayjs().format('YYYY_MM_DD_HH_mm_ss')
    const bakpath = path.join(rootDir, `bak/${folder}`)
    fs.mkdirSync(bakpath)

    const documents = await document.model.find({})
    fs.writeFileSync(path.join(bakpath, 'documents.json'), JSON.stringify(documents, null, 2))

    const books = await book.model.find({})
    fs.writeFileSync(path.join(bakpath, 'books.json'), JSON.stringify(books, null, 2))

    const admins = await admin.model.find({})
    fs.writeFileSync(path.join(bakpath, 'admins.json'), JSON.stringify(admins, null, 2))

    const body: TypesBase.IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: folder
    }
    ctx.body = body
    await next()
  }

  // 备份数据列表
  @get('/api/bak/list')
  async BakList (ctx: Context, next: Next) {
    const bakpath = path.join(rootDir, 'bak')
    let files = glob.sync('./bak/*')
    files = files.map(file => {
      const item = path.relative(bakpath, file)
      return item
    })

    const body: TypesBase.IResponeBodyType<string[]> = {
      code: 0,
      msg: 'success',
      data: files
    }
    ctx.body = body
    await next()
  }

  // 还原数据
  @get('/api/restore/:folder')
  async Restore (ctx: Context, next: Next) {
    const { folder = '' } = ctx.params
    if (folder) {
      const files = glob.sync(`./bak/${folder}/*.json`)
      if (files.length > 0) {
        let code = 0
        for (const file of files) {
          const obj = path.parse(file)
          const type = obj.name
          try {
            const _file = fs.readFileSync(path.join(rootDir, file))
            const content = _file.toString()
            const contentArr = JSON.parse(content)
            if (type === 'documents') {
              await document.model.deleteMany()
              await document.model.insertMany(contentArr)
            } else if (type === 'books') {
              await book.model.deleteMany()
              await book.model.insertMany(contentArr)
            } else if (type === 'admins') {
              await admin.model.deleteMany()
              await admin.model.insertMany(contentArr)
            }
          } catch (_) {
            code = 3
            break
          }
        }
        ctx.body = {
          code: code,
          msg: code === 0 ? '导入数据成功' : '导入出错，请检查备份数据',
          data: folder
        }
      } else {
        ctx.body = {
          code: 2,
          msg: '备份目录为空',
          data: folder
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '参数不正确',
        data: folder
      }
    }
    await next()
  }

}
