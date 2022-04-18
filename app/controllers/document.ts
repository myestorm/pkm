import BaseController from '../core/controller'
import Document from '../models/document'
import * as TypesDocument from '../../types/document'
import { IResponePageBodyType } from '../../types/index'

const sortMethod = (a: TypesDocument.IDocumentDataType, b: TypesDocument.IDocumentDataType): number => {
  if (a.type === b.type) {
    if (a.top) {
      return -1
    } else {
      const _a = a.title.charCodeAt(0)
      const _b = b.title.charCodeAt(0)
      return _a - _b > 0 ? 1 : -1
    }
  } else {
    return a.type === TypesDocument.IDocumentTypeType.DOC ? 1 : -1
  }
}

class DocumentController extends BaseController {

  async add (data: TypesDocument.IDocumentAddType): Promise<TypesDocument.IDocumentDataType> {
    return await Document.create(data)
  }

  async update (data: TypesDocument.IDocumentUpdateType): Promise<TypesDocument.IDocumentDataType | null> {
    return await Document.findByIdAndUpdate(data._id, data, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async remove (id: string): Promise<TypesDocument.IDocumentDataType | null> {
    return await Document.findByIdAndRemove(id)
  }

  async info (id: string): Promise<TypesDocument.IDocumentDataType | null> {
    return await Document.findById(id)
  }

  async list (filter: TypesDocument.IDocumentFilterType): Promise<TypesDocument.IDocumentDataType[]> {
    const list = await Document.find(filter).sort({
      _id: -1
    })
    list.sort(sortMethod)
    return list
  }

  async listPage (page: number, pagesize: number, filter: TypesDocument.IDocumentFilterType): Promise<IResponePageBodyType<TypesDocument.IDocumentDataType>> {
    const start = (page - 1) * pagesize
    const total = await Document.find(filter).count()
    const list: TypesDocument.IDocumentDataType[] = await Document.find(filter).skip(start).limit(pagesize).sort({
      _id: -1
    })
    list.sort(sortMethod)
    const res = {
      list,
      page,
      pagesize,
      total
    }
    return res
  }

  async search (keyword: string, parents: string[] = []): Promise<TypesDocument.IDocumentDataType[]> {
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
    const list = await Document.find(params).sort({
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
