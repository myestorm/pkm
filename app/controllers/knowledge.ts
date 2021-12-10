import Knowledge from '../models/knowledge'
import { IKnowledgeType, IKnowledgeDocType } from '../types/knowledge'

class KnowledgeController {
  async list (): Promise<IKnowledgeType[]> {
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

  async info (id: string): Promise<IKnowledgeType | null> {
    return await Knowledge.findById(id)
  }

  async addDoc (id: string, data: IKnowledgeDocType): Promise<IKnowledgeDocType | null> {
    return await Knowledge.findByIdAndUpdate(id, {
      '$push': {
        children: data
      }
    })
  }
}

export default KnowledgeController
