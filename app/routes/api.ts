import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Knowledge from '../controllers/knowledge'

import { IResponeBodyType } from '../types/index'
import { IKnowledgeType, IKnowledgeDocType } from '../types/knowledge'

const knowledge = new Knowledge()

@prefix('/api')
export default class Api {

  @get('/knowledge/list')
  async KnowledgeList (ctx: Context, next: Next) {
    const result = await knowledge.list()
    const body: IResponeBodyType<IKnowledgeType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @get('/knowledge/info/:id')
  async KnowledgeInfoId (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await knowledge.info(id)
      const body: IResponeBodyType<IKnowledgeType | null> = {
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

  @put('/knowledge/update/:id')
  async KnowledgeUpdateId (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IKnowledgeType
    if (id) {
      const result = await knowledge.update(id, _body)
      const body: IResponeBodyType<IKnowledgeType | null> = {
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

  @del('/knowledge/remove/:id')
  async KnowledgeRemoveId (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await knowledge.remove(id)
      const body: IResponeBodyType<IKnowledgeType | null> = {
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

  @post('/knowledge/add')
  async KnowledgeAdd (ctx: Context, next: Next) {
    const _body = ctx.request.body as unknown as IKnowledgeType
    const result = await knowledge.add(_body)
    const body: IResponeBodyType<IKnowledgeType> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @post('/document/:id/add')
  async DocumentAdd (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IKnowledgeDocType
    if (id) {
      _body.createdAt = new Date()
      if (!_body.publishAt) {
        _body.publishAt = new Date()
      }
      const result = await knowledge.addDoc(id, _body)
      const body: IResponeBodyType<IKnowledgeDocType | null> = {
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
}
