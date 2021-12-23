import { Context, Next } from 'koa'
import { prefix, get, post, put, del } from '../core/router'

import Knowledge from '../controllers/knowledge'
import Recycle from '../controllers/recycle'

import { IResponeBodyType } from '../types/index'
import { IKnowledgeType, IKnowledgeDocType } from '../types/knowledge'
import { IRecycleType } from '../types/recycle'

const knowledge = new Knowledge()
const recycle = new Recycle()

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

  @get('/knowledge/info/:id/:hasChildren?')
  async KnowledgeInfo (ctx: Context, next: Next) {
    const { id = '', hasChildren = 0 } = ctx.params
    const _hasChildren = Number(hasChildren)
    if (id) {
      const result = await knowledge.info(id, Boolean(_hasChildren))
      if (result && result.children && result.children.length > 0) {
        result.children.sort((a, b) => {
          const aOrder = a.order
          const bOrder = b.order
          return aOrder - bOrder
        })
      }
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

  @put('/knowledge/order/:id/:order')
  async KnowledgeOrder (ctx: Context, next: Next) {
    const { id = '', order = 99 } = ctx.params
    if (id) {
      await knowledge.setOrder(id, order)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: ''
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

  @get('/knowledge/document/:id')
  async KnowledgeDocument (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const result = await knowledge.info(id, true)
      const body: IResponeBodyType<IKnowledgeDocType[]> = {
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

  @put('/knowledge/update/:id')
  async KnowledgeUpdate (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IKnowledgeType
    if (id) {
      delete _body.createdAt
      delete _body.updatedAt
      await knowledge.update(id, _body)
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

  @del('/knowledge/remove/:id')
  async KnowledgeRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const info = await knowledge.info(id)
      if (info?.isDefault) {
        ctx.body = {
          code: 2,
          msg: '默认知识库不能删除'
        }
      } else {
        await knowledge.remove(id)
        const body: IResponeBodyType<string> = {
          code: 0,
          msg: 'success',
          data: id
        }
        ctx.body = body
      }
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
    delete _body.createdAt
    delete _body.updatedAt
    const result = await knowledge.add(_body)
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: result._id || ''
    }
    ctx.body = body
    await next()
  }

  @get('/knowledge/set_default/:id')
  async KnowledgeSetDefault (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    await knowledge.setDefault(id)
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: ''
    }
    ctx.body = body
    await next()
  }

  @post('/document/add/:id')
  async DocumentAdd (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    const _body = ctx.request.body as unknown as IKnowledgeDocType
    if (id) {
      delete _body._id
      delete _body.createdAt
      delete _body.updatedAt
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

  @put('/document/update/:id/:did')
  async DocumentUpdate (ctx: Context, next: Next) {
    const { id = '', did = '' } = ctx.params
    const _body = ctx.request.body as unknown as IKnowledgeDocType
    if (id && did) {
      delete _body.createdAt
      delete _body.updatedAt
      const result = await knowledge.updateDoc(id, did, _body)
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

  @put('/document/transfer/:fid/:tid/:did')
  async DocumentTransfer (ctx: Context, next: Next) {
    const { fid = '', tid = '', did = '' } = ctx.params
    if (fid && tid && did) {
      await knowledge.transferDoc(fid, tid, did)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: ''
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

  @del('/document/remove/:id/:did')
  async DocumentRemove (ctx: Context, next: Next) {
    const { id = '', did = '' } = ctx.params
    if (id && did) {
      const result = await knowledge.removeDoc(id, did)
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

  @put('/document/order/:id/:did/:order')
  async DocumentOrder (ctx: Context, next: Next) {
    const { id = '', did = '', order = 99 } = ctx.params
    if (id && did) {
      await knowledge.setOrderDoc(id, did, order)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: ''
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

  // 回收站
  @get('/recycle/list')
  async RecycleList (ctx: Context, next: Next) {
    const result = await recycle.list()
    const body: IResponeBodyType<IRecycleType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  // 清空回收站
  @del('/recycle/remove_all')
  async RecycleRemoveAll (ctx: Context, next: Next) {
    await recycle.removeAll()
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: ''
    }
    ctx.body = body
    await next()
  }

  // 删除回收站中的一条数据
  @del('/recycle/remove/:id/:did')
  async RecycleRemove (ctx: Context, next: Next) {
    const { id = '', did = '' } = ctx.params
    if (id && did) {
      const result = await recycle.remove(id, did)
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
