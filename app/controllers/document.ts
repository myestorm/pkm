import BaseController from '../core/controller'
import Document from '../models/document'
import { IDocumentAddType, IDocumentUpdateType, IDocumentFilterType, IDocumentDataType, IDocumentTypeType } from '../../types/document'

const sortMethod = (a: IDocumentDataType, b: IDocumentDataType): number => {
  if (a.type === b.type) {
    if (a.top) {
      return -1
    } else {
      const _a = a.title.charCodeAt(0)
      const _b = b.title.charCodeAt(0)
      return _a - _b > 0 ? 1 : -1
    }
  } else {
    return a.type === IDocumentTypeType.DOC ? 1 : -1
  }
}

class DocumentController extends BaseController {

  async add (data: IDocumentAddType): Promise<IDocumentDataType> {
    return await Document.create(data)
  }

  async update (data: IDocumentUpdateType): Promise<IDocumentDataType | null> {
    return await Document.findByIdAndUpdate(data._id, data, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async remove (id: string): Promise<IDocumentDataType | null> {
    return await Document.findByIdAndRemove(id)
  }

  async info (id: string): Promise<IDocumentDataType | null> {
    return await Document.findById(id)
  }

  async list (filter: IDocumentFilterType): Promise<IDocumentDataType[]> {
    const list = await Document.find(filter).sort({
      _id: -1
    })
    list.sort(sortMethod)
    return list
  }

  async search (keyword: string, parents: string[] = []): Promise<IDocumentDataType[]> {
    const reg = new RegExp(keyword, 'gmi')
    const and = []
    and.push({
      type: 'document'
    })
    if (parents.length > 0) {
      and.push({
        parents: {
          $in: parents
        }
      })
    }

    const params = {
      $or: [
        { title: { $regex : reg } },
        { desc: { $regex : reg } },
        { tags: { $regex : reg } }
        // { content: { $regex : reg } }
      ],
      $and: and
    }
    const list = await Document.find(params, '_id title desc parents type').sort({
      _id: -1
    })
    list.sort(sortMethod)
    return list
  }

  async count (id: string): Promise<number> {
    const total = await Document.find({
      parents: {
        $in: [id]
      }
    }).count()
    return total
  }

}

export default DocumentController
