import { Context, Next } from 'koa'
import { prefix, get, del } from '../core/router'

import Recycle from '../controllers/recycle'

import { IResponeBodyType } from '../../types/index'
import { IRecycleMongoType } from '../../types/recycle'

const recycle = new Recycle()

@prefix('/api/recycle')
export default class Api {

  // 回收站
  @get('/list')
  async RecycleList (ctx: Context, next: Next) {
    const result = await recycle.list()
    const body: IResponeBodyType<IRecycleMongoType[]> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  // 清空回收站
  @del('/remove_all')
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
  @del('/remove/:id/:did')
  async RecycleRemove (ctx: Context, next: Next) {
    const { id = '', did = '' } = ctx.params
    if (id && did) {
      const result = await recycle.remove(id, did)
      const body: IResponeBodyType<string> = {
        code: 0,
        msg: 'success',
        data: result?._id ? result?._id.toString() : ''
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
