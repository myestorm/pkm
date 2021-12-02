import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

import { IResponeBodyType, IResponePageBodyType } from '../types/index'
import { IDocumentListItemType, IDocumentListQueryType, IDocumentType } from '../types/document'

@prefix('/api')
export default class Api {
  @get('/documents')
  async Document (ctx: Context, next: Next) {
    const query = ctx.query as unknown as IDocumentListQueryType
    const { page = 1, pagesize = 10, keyword = '' } = query
    const list: IDocumentListItemType[] = []
    for (let i = 0; i < pagesize; i++) {
      list.push({
        id: i + 1,
        title: 'JS版本的工具包集合' + keyword,
        desc: '但同样的，JS没有类型检查；提供对外接口代码补全、智能提示都不够友好；书写不规范很容易诱导发生很多隐蔽的bug，而且影响代码的可读性',
        createdAt: new Date()
      })
    }
    const data: IResponePageBodyType<IDocumentListItemType> = {
      list,
      page,
      pagesize,
      total: 28
    }
    const body: IResponeBodyType<IResponePageBodyType<IDocumentListItemType>> = {
      code: 0,
      msg: 'success',
      data
    }
    ctx.body = body
    await next()
  }

  @get('/document/:id')
  async DocumentId (ctx: Context, next: Next) {
    const params = ctx.params as unknown as {
      id: number
    }
    const { id } = params
    if (id) {
      const data: IDocumentType = {
        id,
        title: 'JS版本的工具包集合',
        desc: '但同样的，JS没有类型检查；提供对外接口代码补全、智能提示都不够友好；书写不规范很容易诱导发生很多隐蔽的bug，而且影响代码的可读性',
        content: '## 但同样的，JS没有\n类型检查；提供对外接口代码补全、智能提示都不够友好；书写不规范很容易诱导发生很多隐蔽的bug，而且影响代码的可读性',
        createdAt: new Date()
      }
      const body: IResponeBodyType<IDocumentType> = {
        code: 0,
        msg: 'success',
        data
      }
      ctx.body = body
    } else {
      ctx.throw(404)
    }
    await next()
  }
}
