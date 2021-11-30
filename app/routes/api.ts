import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

import { IResponeBodyType, IResponePageBodyType } from '../types/index'
import { IDocumentListItemType } from '../types/document'

@prefix('/api')
export default class Api {
  @get('/documents')
  async Document (ctx: Context, next: Next) {
    const list: IDocumentListItemType[] = []
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i + 1,
        title: 'JS版本的工具包集合',
        desc: '但同样的，JS没有类型检查；提供对外接口代码补全、智能提示都不够友好；书写不规范很容易诱导发生很多隐蔽的bug，而且影响代码的可读性',
        createdAt: new Date()
      })
    }
    const data: IResponePageBodyType<IDocumentListItemType> = {
      list,
      page: 1,
      pagesize: 10,
      total: 30
    }
    const body: IResponeBodyType<IResponePageBodyType<IDocumentListItemType>> = {
      code: 0,
      msg: 'success',
      data
    }
    ctx.body = body
    await next()
  }
}