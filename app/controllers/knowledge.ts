import Knowledge from '../models/knowledge'
import { IKnowledgeType, IKnowledgeUpdateType } from '../types/knowledge'

class KnowledgeController {
  async find (): Promise<IKnowledgeType[]> {
    return await Knowledge.find().sort({
      _id: -1
    })
  }

  async add (data: IKnowledgeType): Promise<IKnowledgeType> {
    return await new Knowledge(data).save()
  }

  async update (id: string, data: IKnowledgeType): Promise<IKnowledgeType | null> {
    return await Knowledge.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  }

  async remove (id: string): Promise<IKnowledgeType | null> {
    return await Knowledge.findByIdAndRemove(id)
  }

  async findById (id: string): Promise<IKnowledgeType | null> {
    return await Knowledge.findOne({ id })
  }
}

export default KnowledgeController
