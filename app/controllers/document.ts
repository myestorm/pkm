import BaseController from '../core/controller'
import Document from '../models/document'

import * as TypesDocument from '../../types/document'
import * as TypesIndex from '../../types/index'

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

  async updateDirectory (id: string, directory: string[]): Promise<TypesDocument.IDocumentDataType | null> {
    return await Document.findByIdAndUpdate(id, { directory }, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    })
  }

  async updateOrder (id: string, order: number): Promise<TypesDocument.IDocumentDataType | null> {
    return await Document.findByIdAndUpdate(id, { order }, { 
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
    list.sort(this.sortMethod)
    return list
  }

  async listPage (page: number, pagesize: number, filter: TypesDocument.IDocumentFilterType): Promise<TypesIndex.IResponePageBodyType<TypesDocument.IDocumentDataType>> {
    const start = (page - 1) * pagesize
    const total = await Document.find(filter).count()
    const list: TypesDocument.IDocumentDataType[] = await Document.find(filter).skip(start).limit(pagesize).sort({
      _id: -1
    })
    list.sort(this.sortMethod)
    const res = {
      list,
      page,
      pagesize,
      total
    }
    return res
  }

  async search (keyword: string, directory: string[] = []): Promise<TypesDocument.IDocumentDataType[]> {
    const reg = new RegExp(keyword, 'gmi')
    const and = []
    and.push({
      type: 'document'
    })
    if (directory.length > 0) {
      and.push({
        directory: {
          $in: directory
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
    list.sort(this.sortMethod)
    return list
  }

  async count (id: string): Promise<number> {
    const total = await Document.find({
      directory: {
        $in: [id]
      }
    }).count()
    return total
  }

}

export default DocumentController
