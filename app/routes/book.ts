import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import * as TypesBase from '../types/base'
import * as TypesBook from '../types/book'

import Book from '../controllers/book'

const book = new Book()

@prefix('/api/book')
export default class User {

  @post('/list')
  async BookList (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBook.IBookQueryType
    const result = await book.list<TypesBook.IBookQueryType>(_body)
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/list/page')
  async BookListPage (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBase.IPageType<{}>
    const result = await book.listPage(_body.page, _body.pagesize, {})
    const body: TypesBase.IResponeBodyType<TypesBase.IResponePageType<TypesBook.IBookType>> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
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

  @post('/search')
  async BookSearch (ctx: Context, next: Next) {
    const { keyword, directory } = ctx.request.body as TypesBase.ISearchParamsType
    const result = await book.search(keyword, directory)
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/copy')
  async BookCopy (ctx: Context, next: Next) {
    const { id, directory } = ctx.request.body as { id: string, directory: string[] }
    const result = await book.copyBook(id, directory)
    const body: TypesBase.IResponeBodyType<boolean> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/move')
  async BookMove (ctx: Context, next: Next) {
    const { id, directory } = ctx.request.body as { id: string, directory: string[] }
    const result = await book.move(id, directory)
    const body: TypesBase.IResponeBodyType<boolean> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id/order')
  async BookOrder (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const { order } = ctx.request.body as { order: number }
    const result = await book.updateById(id, { order })
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id/directory')
  async DocumentUpdateDirectory (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as { directory: string[] }
    const result = await book.updateById(id, { directory: _body.directory })
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id')
  async DocumentUpdate (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as TypesBook.IBookUpdateType
    const postData = book.methods.clearUnnecessaryFields(_body, ['title', 'directory', 'type', 'cover', 'desc', 'tags', 'author', 'readed', 'heard', 'purchased', 'ISBN', 'rating'])
    const result = await book.updateById(id, postData)
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/create')
  async BookCreate (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBook.IBookCreateType
    const postData = book.methods.clearUnnecessaryFields(_body, ['title', 'directory', 'type', 'cover', 'desc', 'tags', 'author', 'readed', 'heard', 'purchased', 'ISBN', 'rating'])
    const result = await book.create(postData)
    const body: TypesBase.IResponeBodyType<TypesBook.IBookType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @get('/info/:id')
  async BookInfo (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await book.info(id)
      const body: TypesBase.IResponeBodyType<TypesBook.IBookType | null> = {
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

  @post('/note/add/:bookId')
  async NoteAdd (ctx: Context, next: Next) {
    const { bookId = '' } = ctx.params
    if (!bookId) {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    } else {
      const _body = ctx.request.body as TypesBook.INoteCreateType
      const result = await book.addNote(bookId, _body)
      const body: TypesBase.IResponeBodyType<TypesBook.INoteType | null> = {
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
      const _body = ctx.request.body as TypesBook.INoteUpdateType
      const info = await book.noteInfo(bookId, noteId)
      if (info) {
        const result = await book.updateNote(bookId, noteId, _body)
        const body: TypesBase.IResponeBodyType<TypesBook.INoteType | null> = {
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
