import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Document from '../controllers/document'
import { IResponeBodyType } from '../../types/index'
import { IDocumentRouteAddType, IDocumentRouteUpdateType, IDocumentFilterType, IDocumentDataType } from '../../types/document'

const document = new Document()

@prefix('/api/document')
export default class DocumentRouter {

  @post('/add')
  async DocumentAdd (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const _body = ctx.request.body as IDocumentRouteAddType
    _body.authorId = userinfo._id
    _body.createdBy = userinfo._id
    _body.updatedBy = userinfo._id
    const result = await document.add(_body)
    const body: IResponeBodyType<IDocumentDataType> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update')
  async DocumentUpdate (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const _body = ctx.request.body as IDocumentRouteUpdateType
    _body.updatedBy = userinfo._id
    const info = await document.info(_body._id)
    if (info) {
      const __body = Object.assign(info, _body)
      const result = await document.update(__body)
      const body: IResponeBodyType<IDocumentDataType | null> = {
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
  async DocumentRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const info = await document.info(id)
      if (info) {
        const total = await document.count(info._id.toString())
        if (total === 0) {
          await document.remove(id)
          const body: IResponeBodyType<string> = {
            code: 0,
            msg: 'success',
            data: id
          }
          ctx.body = body
        } else {
          ctx.body = {
            code: 3,
            msg: '目录下还有文件，请先删除子目录或文件'
          }
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
  async DocumentInfo (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await document.info(id)
      const body: IResponeBodyType<IDocumentDataType | null> = {
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
  async DocumentList (ctx: Context, next: Next) {
    const _body = ctx.request.body as IDocumentFilterType
    const result = await document.list(_body)
    const body: IResponeBodyType<IDocumentDataType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/search/:keyword')
  async DocumentSearch (ctx: Context, next: Next) {
    const { keyword = '' } = ctx.params
    const _body = ctx.request.body as { parents: string[] }
    const result = await document.search(keyword, _body.parents)
    const body: IResponeBodyType<IDocumentDataType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }
}