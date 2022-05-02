import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'
// import path from 'path'
// import ejs from 'ejs'
import * as TypesBase from '../types/base'
import Document from '../controllers/document'
import Book from '../controllers/book'

const document = new Document()
const book = new Book()

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

  @get('/api/recent')
  async Recent (ctx: Context, next: Next) {
    const { keyword = '' } = ctx.params
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

}
