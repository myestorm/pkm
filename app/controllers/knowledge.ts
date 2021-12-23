import Knowledge from '../models/knowledge'
import Recycle from '../models/recycle'
import { IKnowledgeType, IKnowledgeDocType, IKnowledgeUpdateType, IKnowledgeDocUpdateType } from '../types/knowledge'

import BaseController from '../core/controller'

const updateOption = { 
  new: true, 
  upsert: true,
  setDefaultsOnInsert: true,
  runValidators: true, 
  findByIdAndUpdate: 'after' 
}

const sortOption = {
  order: 1,
  updatedAt: 1,
  _id: -1,
  createdAt: -1
}

class KnowledgeController extends BaseController {
  async list (): Promise<IKnowledgeType[]> {
    return await Knowledge.find({}, {
      children: 0
    }).sort(sortOption)
  }

  async setDefault (id: string): Promise<void> {
    await Knowledge.updateMany({ _id: {
      $ne: id
    } }, { isDefault: false })
    await Knowledge.findByIdAndUpdate(id, {
      isDefault: true
    })
  }

  async setOrder (id: string, order: number): Promise<void> {
    await Knowledge.findByIdAndUpdate(id, {
      order
    })
  }

  async add (data: IKnowledgeType): Promise<IKnowledgeType> {
    return await new Knowledge(data).save()
  }

  async update (id: string, data: IKnowledgeUpdateType): Promise<IKnowledgeType | null> {
    return await Knowledge.findByIdAndUpdate(id, data, updateOption)
  }

  async remove (id: string): Promise<IKnowledgeType | null> {
    const _list = await Knowledge.findByIdAndRemove(id)
    if (_list) {
      const _info = await Knowledge.findOne({
        isDefault: true
      })
      if (_info && _list.children) {
        _list.children.map(item => {
          _info.children.push(item)
        })
      }
    }
    return _list
  }

  async info (id: string, hasChildren: boolean = false): Promise<IKnowledgeType | null> {
    const opts = hasChildren ? {} : {
      children: 0
    }
    return await Knowledge.findById(id, opts)
  }

  async addDoc (id: string, data: IKnowledgeDocType): Promise<IKnowledgeDocType | null> {
    const parent = await Knowledge.findById(id)
    parent?.children.unshift(data)
    await parent?.save()
    return parent?.children[0] || null
  }

  async updateDoc (id: string, did: string, data: IKnowledgeDocUpdateType): Promise<IKnowledgeDocType | null> {
    const parent = await Knowledge.findById(id)
    let sub = parent?.children.id(did)
    sub = Object.assign(sub, data)
    await parent?.save()
    return sub
  }

  async setOrderDoc (id: string, did: string, order: number): Promise<IKnowledgeDocType | null> {
    const parent = await Knowledge.findById(id)
    let sub = parent?.children.id(did)
    sub.order = order
    await parent?.save()
    return sub
  }

  async transferDoc (fid: string, tid: string, id: string) {
    const fromParent = await Knowledge.findById(fid)
    const sub = fromParent?.children.id(id)
    sub.remove()
    await fromParent?.save()

    const toParent = await Knowledge.findById(tid)
    toParent?.children.unshift(sub)
    await toParent?.save()
    return sub
  }

  async removeDoc (id: string, did: string): Promise<IKnowledgeDocType | null> {
    const parent = await Knowledge.findById(id)
    const sub = parent?.children.id(did)
    sub.remove()
    await parent?.save()

    // 加入回收站
    const title = this.dayjs(new Date()).format('YYYY-MM')
    const _info = await Recycle.findOne({
      title
    })
    let children: IKnowledgeDocType[] = [
      sub
    ]
    if (_info && _info.children) {
      children = children.concat(_info.children)
    }
    await Recycle.findOneAndUpdate({
      title
    }, {
      title,
      children
    }, updateOption)
    return sub
  }
}

export default KnowledgeController
