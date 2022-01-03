import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Bookrack from '../controllers/bookrack'

import { IResponeBodyType } from '../types/index'
import { 
  IBookrackGroupType,
  IBookType,
  IControllerBookrackGroupAddType,
  IControllerBookAddType,
 } from '../../types/bookrack'

const bookrack = new Bookrack()

@prefix('/bookrack')
export default class BookrackRouter {

  @get('/list')
  async BookrackList (ctx: Context, next: Next) {
    const result = await bookrack.list()
    const body: IResponeBodyType<IBookrackGroupType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @get('/info/:id/:hasChildren?')
  async BookrackInfo (ctx: Context, next: Next) {
    const { id = '', hasChildren = 0 } = ctx.params
    const _hasChildren = Number(hasChildren)
    if (id) {
      const result = await bookrack.info(id, Boolean(_hasChildren))
      if (result && result.children && result.children.length > 0) {
        result.children.sort((a, b) => {
          const aOrder = <number>new Date(a.createdAt).getTime()
          const bOrder = <number>new Date(b.createdAt).getTime()
          return aOrder - bOrder
        })
      }
      const body: IResponeBodyType<IBookrackGroupType | null> = {
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

  @put('/update/:id')
  async BookrackUpdate (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IControllerBookrackGroupAddType
    if (id) {
      await bookrack.update(id, _body)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: id
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
  async BookrackRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const info = await bookrack.info(id)
      if (info) {
        await bookrack.remove(id)
      }
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: id
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

  @post('/add')
  async BookrackAdd (ctx: Context, next: Next) {
    const _body = ctx.request.body as unknown as IControllerBookrackGroupAddType
    const result = await bookrack.add(_body)
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: result._id || ''
    }
    ctx.body = body
    await next()
  }

  @get('/book/:id')
  async BookrackBooks (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await bookrack.info(id, true)
      const body: IResponeBodyType<IBookType[]> = {
        code: 0,
        msg: 'success',
        data: result?.children || []
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

  @post('/book/add/:gid')
  async BookAdd (ctx: Context, next: Next) {
    const { gid = '' } = ctx.params
    const _body = ctx.request.body as unknown as IControllerBookAddType
    if (gid) {
      const result = await bookrack.addBook(gid, _body)
      const body: IResponeBodyType<IBookType | null> = {
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

  @put('/book/update/:gid/:id')
  async BookUpdate (ctx: Context, next: Next) {
    const { gid = '', id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IControllerBookAddType
    if (gid && id) {
      const result = await bookrack.updateBook(gid, id, _body)
      const body: IResponeBodyType<IBookType | null> = {
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

  @del('/book/remove/:gid/:id')
  async BookRemove (ctx: Context, next: Next) {
    const { gid = '', id = '' } = ctx.params
    if (gid && id) {
      const result = await bookrack.removeBook(gid, id)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: result?._id || ''
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

}
