import Recycle from '../models/recycle'
import { IRecycleType } from '../types/recycle'
import { IKnowledgeDocType } from '../types/knowledge'

import BaseController from '../core/controller'

class RecycleController extends BaseController {
  async list (): Promise<IRecycleType[]> {
    return await Recycle.find().sort({
      _id: -1
    })
  }

  async removeAll (): Promise<void> {
    await Recycle.remove()
  }

  async remove (id: string, did: string): Promise<IKnowledgeDocType | null> {
    const parent = await Recycle.findById(id)
    const sub = parent?.children.id(did)
    sub.remove()
    await parent.save()
    return sub
  }
}

export default RecycleController