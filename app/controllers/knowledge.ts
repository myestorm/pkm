import { now } from 'mongoose'
import Knowledge from '../models/knowledge'
import { IKnowledgeType } from '../types/knowledge'

class KnowledgeController {
  async find (): Promise<IKnowledgeType[]> {
    return await Knowledge.find()
  }

  async add (data: IKnowledgeType): Promise<IKnowledgeType> {
    return await new Knowledge(data).save()
  }
}

export default KnowledgeController
