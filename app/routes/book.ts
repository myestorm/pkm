import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import * as TypesBook from '../../types/book'
import { IResponeBodyType, IResponePageBodyType, IPageType } from '../../types/index'
import Book from '../controllers/book'

const book = new Book()

@prefix('/api/book')
export default class User {

  @post('/add')
  async BookAdd (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBook.IBookRouteAddType
    const result = await book.add(_body)
    const body: IResponeBodyType<TypesBook.IBookDataType> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update')
  async BookUpdate (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBook.IBookRouteUpdateType
    const info = await book.info(_body._id)
    if (info) {
      const __body = Object.assign(info, _body)
      const result = await book.update(__body)
      const body: IResponeBodyType<TypesBook.IBookDataType | null> = {
        code: 0,
        msg: 'success',
        data: result
      }
      ctx.body = body
    } else {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    }
    await next()
  }

  @del('/remove/:id')
  async BookRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const info = await book.info(id)
      if (info) {
        await book.remove(id)
        ctx.body = {
          code: 0,
          msg: 'success',
          data: id
        }
      } else {
        ctx.body = {
          code: 2,
          msg: '参数不正确'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    }
    await next()
  }

  @get('/info/:id')
  async BookInfo (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await book.info(id)
      const body: IResponeBodyType<TypesBook.IBookDataType | null> = {
        code: 0,
        msg: 'success',
        data: result
      }
      ctx.body = body
    } else {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    }
    await next()
  }

  @post('/list')
  async BookList (ctx: Context, next: Next) {
    const result = await book.list()
    const body: IResponeBodyType<TypesBook.IBookDataType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/list/page')
  async BookListPage (ctx: Context, next: Next) {
    const _body = ctx.request.body as IPageType<{}>
    const result = await book.listPage(_body.page, _body.pagesize)
    const body: IResponeBodyType<IResponePageBodyType<TypesBook.IBookDataType>> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/search/:keyword')
  async BookSearch (ctx: Context, next: Next) {
    const { keyword = '' } = ctx.params
    const result = await book.search(keyword)
    const body: IResponeBodyType<TypesBook.IBookDataType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/note/add/:bookId')
  async NoteAdd (ctx: Context, next: Next) {
    const { bookId = '' } = ctx.params
    if (!bookId) {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    } else {
      const _body = ctx.request.body as TypesBook.INoteControlAddType
      const result = await book.addNote(bookId, _body)
      const body: IResponeBodyType<TypesBook.INoteControlReurnType | null> = {
        code: 0,
        msg: 'success',
        data: result
      }
      ctx.body = body
    }
    await next()
  }

  @put('/note/update/:bookId/:noteId')
  async NoteUpdate (ctx: Context, next: Next) {
    const { bookId = '', noteId = '' } = ctx.params
    if (!bookId || !noteId) {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    } else {
      const _body = ctx.request.body as TypesBook.INoteControlAddType
      const info = await book.noteInfo(bookId, noteId)
      if (info) {
        const result = await book.updateNote(bookId, noteId, _body)
        const body: IResponeBodyType<TypesBook.INoteControlReurnType | null> = {
          code: 0,
          msg: 'success',
          data: result
        }
        ctx.body = body
      } else {
        ctx.body = {
          code: 1,
          msg: '参数不正确'
        }
      }
    }
    await next()
  }

  @del('/note/remove/:bookId/:noteId')
  async NoteRemove (ctx: Context, next: Next) {
    const { bookId = '', noteId = '' } = ctx.params
    if (!bookId || !noteId) {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    } else {
      const info = await book.noteInfo(bookId, noteId)
      if (info) {
        await book.removeNote(bookId, noteId)
        ctx.body = {
          code: 0,
          msg: 'success',
          data: noteId
        }
      } else {
        ctx.body = {
          code: 2,
          msg: '参数不正确'
        }
      }
    }
    await next()
  }

  @get('/note/:bookId/:noteId')
  async NoteInfo (ctx: Context, next: Next) {
    const { bookId = '', noteId = '' } = ctx.params
    if (!bookId || !noteId) {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    } else {
      const info = await book.noteInfo(bookId, noteId)
      ctx.body = {
        code: 0,
        msg: 'success',
        data: info
      }
    }
    await next()
  }
}
