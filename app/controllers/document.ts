import BaseController from '../core/controller'
import Document from '../models/document'

import * as TypesDocument from '../types/document'

class DocumentController extends BaseController<TypesDocument.IDocumentModelType> {

  constructor () {
    super(Document)
  }

  async updateContent (id: string, content: string): Promise<TypesDocument.IDocumentType | null> {
    return await Document.findByIdAndUpdate(id, { content }, this.options.update)
  }

  async count (id: string): Promise<number> {
    const total = await Document.find({
      directory: {
        $in: [id]
      }
    }).count()
    return total
  }

  async copyDocument (id: string, directory: string[] = []): Promise<boolean> {
    const result = this.copy(id, directory, (data: TypesDocument.IDocumentType) => {
      return {
        _id: data._id,
        title: data.title,
        directory: data.directory,
        type: data.type,
        cover: data.cover,
        desc: data.desc,
        content: data.content,
        tags: data.tags,
        top: data.top,
        order: data.order,
        comments: [],
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        updatedBy: data.updatedBy,
        updatedAt: data.updatedAt
      }
    })
    return result
  }

}

export default DocumentController
