import BaseController from '../core/controller'
import Document from '../models/document'

import * as TypesDocument from '../types/document'

class DocumentController extends BaseController<TypesDocument.IDocumentModelType> {

  constructor () {
    super(Document)
  }

  async copyDocument (id: string, directory: string[] = []): Promise<boolean> {
    const result = this.copy(id, directory, (data: TypesDocument.IDocumentType) => {
      const _data = this.methods.clearUnnecessaryFields(data, ['_id', 'title', 'directory', 'type', 'cover', 'desc', 'content', 'tags', 'top', 'order', 'comments'])
      return _data
    })
    return result
  }

}

export default DocumentController
