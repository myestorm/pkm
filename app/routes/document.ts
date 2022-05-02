import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Document from '../controllers/document'
import * as TypesBase from '../types/base'
import * as TypesDocument from '../types/document'

const document = new Document()

@prefix('/api/document')
export default class DocumentRouter {

  @post('/create')
  async DocumentCreate (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesDocument.IDocumentCreateType
    const postData = document.methods.clearUnnecessaryFields(_body, ['title', 'directory', 'type', 'cover', 'desc', 'tags', 'content'])
    const result = await document.create(postData)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id/order')
  async DocumentUpdateOrder (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as { order: number }
    const result = await document.updateById(id, { order: _body.order })
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
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
    const result = await document.updateById(id, { directory: _body.directory })
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id/content')
  async DocumentUpdateContent (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as { content: string }
    await document.updateById(id, { content: _body.content })
    const body: TypesBase.IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: id
    }
    ctx.body = body
    await next()
  }

  @put('/update/:id')
  async DocumentUpdate (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as TypesDocument.IDocumentUpdateType
    const postData = document.methods.clearUnnecessaryFields(_body, ['title', 'directory', 'type', 'cover', 'desc', 'tags'])
    const result = await document.updateById(id, postData)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType | null> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @del('/remove/:id')
  async DocumentRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const total = await document.countChildren(id)
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
          code: 2,
          msg: '目录下还有文件，请先删除子目录或文件'
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
    const _body = ctx.request.body as TypesDocument.IDocumentQueryType
    const result = await document.list(_body)
    const body: TypesBase.IResponeBodyType<TypesDocument.IDocumentType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/list/page')
  async DocumentListPage (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBase.IPageType<TypesDocument.IDocumentQueryType>
    const conditions = _body.conditions
    const result = await document.listPage(_body.page, _body.pagesize, conditions)
    const body: TypesBase.IResponeBodyType<TypesBase.IResponePageType<TypesDocument.IDocumentType>> = {
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
