import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Document from '../controllers/document'
import * as TypesBase from '../types/base'
import * as TypesDocument from '../types/document'

const document = new Document()

@prefix('/api/document')
export default class DocumentRouter {

  @post('/add')
  async DocumentAdd (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesDocument.IDocumentAddRouteType
    const id = _body._id
    const postData: TypesDocument.IDocumentAddType = {
      title: _body.title,
      directory: _body.directory,
      cover: _body.cover,
      desc: _body.desc,
      tags: _body.tags,
      type: _body.type
    }
    const result = id ? await document.update(id, postData) : await document.add(postData)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/order')
  async DocumentUpdateOrder (ctx: Context, next: Next) {
    const _body = ctx.request.body as { id: string, order: number }
    const info = await document.info(_body.id)
    if (info) {
      const result = await document.updateOrder(_body.id, _body.order)
      const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
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

  @put('/update/content')
  async DocumentUpdateContent (ctx: Context, next: Next) {
    const _body = ctx.request.body as { id: string, content: string }
    const info = await document.info(_body.id)
    if (info) {
      const result = await document.updateContent(_body.id, _body.content)
      const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
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
          const body: TypesBase.IResponeBodyType<string> = {
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
      const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
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
    const _body = ctx.request.body as TypesDocument.IDocumentPartialType
    const result = await document.list(_body)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/breadcrumbs')
  async DocumentInfoFind (ctx: Context, next: Next) {
    const { ids } = ctx.request.body as { ids: string[] }
    let body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]> = {
      code: 0,
      msg: 'success',
      data: []
    }
    if (Array.isArray(ids) && ids.length > 0) {
      const result = await document.breadcrumbs(ids)
      body = {
        code: 0,
        msg: 'success',
        data: result
      }
    }
    ctx.body = body
    await next()
  }

  @post('/list/page')
  async DocumentListPage (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBase.IPageType<TypesDocument.IDocumentPartialType>
    const conditions = _body.conditions as TypesDocument.IDocumentPartialType
    const result = await document.listPage(_body.page, _body.pagesize, conditions)
    const body: TypesBase.IResponeBodyType<TypesBase.IResponePageBodyType<TypesDocument.IDocumentType>> = {
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
    const _body = ctx.request.body as { directory: string[] }
    const result = await document.search(keyword, _body.directory)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/copy')
  async DocumentCopy (ctx: Context, next: Next) {
    const { id, directory } = ctx.request.body as { id: string, directory: string[] }
    const result = await document.copyDocument(id, directory)
    const body: TypesBase.IResponeBodyType<boolean> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/move')
  async DocumentMove (ctx: Context, next: Next) {
    const { id, directory } = ctx.request.body as { id: string, directory: string[] }
    const result = await document.move(id, directory)
    const body: TypesBase.IResponeBodyType<boolean> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

}