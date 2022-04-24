import BaseController from '../core/controller'
import Document from '../models/document'

import * as TypesBase from '../types/base'
import * as TypesDocument from '../types/document'

class DocumentController extends BaseController<TypesDocument.IDocumentModelType> {

  constructor () {
    super(Document)
  }

  // async add (data: TypesDocument.IDocumentAddType): Promise<TypesDocument.IDocumentType> {
  //   return await Document.create(data)
  // }

  // async update (id: string, data: TypesDocument.IDocumentAddType): Promise<TypesDocument.IDocumentType | null> {
  //   return await Document.findByIdAndUpdate(id, data, this.updateOption)
  // }

  // async updateDirectory (id: string, directory: string[]): Promise<TypesDocument.IDocumentType | null> {
  //   return await Document.findByIdAndUpdate(id, { directory }, this.updateOption)
  // }

  // async updateOrder (id: string, order: number): Promise<TypesDocument.IDocumentType | null> {
  //   return await Document.findByIdAndUpdate(id, { order }, this.updateOption)
  // }

  async updateContent (id: string, content: string): Promise<TypesDocument.IDocumentType | null> {
    return await Document.findByIdAndUpdate(id, { content }, this.updateOption)
  }

  // async remove (id: string): Promise<TypesDocument.IDocumentType | null> {
  //   return await Document.findByIdAndRemove(id)
  // }

  // async info (id: string): Promise<TypesDocument.IDocumentType | null> {
  //   return await Document.findById(id)
  // }

  // async list (filter: TypesDocument.IDocumentPartialType): Promise<TypesDocument.IDocumentType[]> {
  //   const list = await Document.find(filter).sort({
  //     _id: -1
  //   })
  //   list.sort(this.sortMethod)
  //   return list
  // }

  // async listPage (page: number, pagesize: number, filter: TypesDocument.IDocumentPartialType): Promise<TypesBase.IResponePageBodyType<TypesDocument.IDocumentType>> {
  //   const start = (page - 1) * pagesize
  //   const total = await Document.find(filter).count()
  //   const list: TypesDocument.IDocumentType[] = await Document.find(filter).skip(start).limit(pagesize).sort({
  //     _id: -1
  //   })
  //   list.sort(this.sortMethod)
  //   const res = {
  //     list,
  //     page,
  //     pagesize,
  //     total
  //   }
  //   return res
  // }

  // async search (keyword: string, directory: string[] = []): Promise<TypesDocument.IDocumentType[]> {
  //   const reg = new RegExp(keyword, 'gmi')
  //   const and = []
  //   and.push({
  //     type: 'file'
  //   })
  //   if (directory.length > 0) {
  //     and.push({
  //       directory: {
  //         $in: directory
  //       }
  //     })
  //   }

  //   const params = {
  //     $or: [
  //       { title: { $regex : reg } },
  //       { desc: { $regex : reg } },
  //       { tags: { $regex : reg } }
  //       // { content: { $regex : reg } }
  //     ],
  //     $and: and
  //   }
  //   const list = await Document.find(params).sort({
  //     _id: -1
  //   })
  //   list.sort(this.sortMethod)
  //   return list
  // }

  async count (id: string): Promise<number> {
    const total = await Document.find({
      directory: {
        $in: [id]
      }
    }).count()
    return total
  }

  async findInfo (ids: string[]): Promise<TypesDocument.IDocumentType[]> {
    const list = await Document.find({
      _id: {
        $in: ids
      }
    }, '_id title directory')
    return list
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

  // async copy (id: string, directory: string[] = []): Promise<boolean> {
  //   try {
  //     const info = await Document.findById(id)
  //     const oldDirectory = info ? [...info.directory] : []

  //     const list = await Document.find({
  //       $or: [{
  //         _id: id
  //       }, {
  //         directory: { // 数组包含某个元素
  //           $elemMatch: {
  //             $eq: id
  //           }
  //         }
  //       }]
  //     })

  //     type ITempType = Omit<TypesDocument.IDocumentType, '_id'> & {
  //       _id: string,
  //       oldId: string
  //     }

  //     let _list: ITempType[] = []
  //     list.map(item => {
  //       const _id = item._id.toString()
  //       const _item = {
  //         ...item.toJSON(),
  //         _id: this.createObjectId().toString(),
  //         oldId: _id
  //       }
  //       _list.push(_item)
  //       return item
  //     })
  //     const folders = _list.filter(item => item.type === TypesBase.IBaseTypesType.FOLDER)
  //     const char = '|||'
  //     _list = _list.map(item => {
  //       let _directory = item.directory.join(char)
  //       const _oldDirectory = oldDirectory.join(char)
  //       const __directory = directory.join(char)
  //       _directory = _oldDirectory ? _directory.replace(_oldDirectory, __directory) : `${__directory}${char}${_directory}`
  //       folders.map(folder => {
  //         _directory = _directory.replace(folder.oldId, folder._id)
  //       })
  //       item.directory = _directory.split(char)
  //       item.directory = item.directory.filter(sub => Boolean(sub))
  //       return item
  //     })
      
  //     for (const itemData of _list) {
  //       await Document.create({
  //         _id: itemData._id,
  //         title: itemData.title,
  //         directory: itemData.directory,
  //         type: itemData.type,
  //         cover: itemData.cover,
  //         desc: itemData.desc,
  //         content: itemData.content,
  //         tags: itemData.tags,
  //         top: itemData.top,
  //         order: itemData.order,
  //         comments: [],
  //         createdBy: itemData.createdBy,
  //         createdAt: itemData.createdAt,
  //         updatedBy: itemData.updatedBy,
  //         updatedAt: itemData.updatedAt
  //       })
  //     }
      
  //     return true
  //   } catch (_) {
  //     return false
  //   }
  // }

  // async move (id: string, directory: string[] = []): Promise<boolean> {
  //   try {
  //     const info = await Document.findById(id)
  //     const oldDirectory = info ? [...info.directory] : []

  //     const list = await Document.find({
  //       $or: [{
  //         _id: id
  //       }, {
  //         directory: { // 数组包含某个元素
  //           $elemMatch: {
  //             $eq: id
  //           }
  //         }
  //       }]
  //     }, '_id directory')

  //     const char = '|||'
  //     const _list: { _id: string, directory: string[]}[] = list.map(item => {
  //       const _id = item._id.toString()
  //       let _directory = item.directory.join(char)
  //       _directory = _directory.replace(oldDirectory.join(char), directory.join(char))
  //       _directory = _directory.replace(/^\|\|\|/, '')
  //       const newDirectory = _directory ? _directory.split(char) : []
  //       return {
  //         _id,
  //         directory: newDirectory
  //       }
  //     })
      
  //     for (const itemData of _list) {
  //       await Document.findByIdAndUpdate(itemData._id, { directory: [...itemData.directory] }, this.updateOption)
  //     }
      
  //     return true
  //   } catch (_) {
  //     return false
  //   }
  // }

}

export default DocumentController
