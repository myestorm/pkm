import { now } from 'mongoose'
import Knowledge from '../models/knowledge'
import { IKnowledgeType } from '../types/knowledge'

class KnowledgeController {
  async find () {
    return await Knowledge.find()
  }

  async add (data: IKnowledgeType) {
    data.createdAt = now()
    return await new Knowledge(data).save()
  }
}

export default KnowledgeController
