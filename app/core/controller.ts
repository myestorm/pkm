import { Types, Model } from 'mongoose'
import dayjs from 'dayjs'
import * as TypesBase from '../types/base'

class BaseController<T> {
  model: Model<T>
  
  constructor (model: Model<T>) {
    this.model = model
  }

  async add<A> (data: A): Promise<T> {
    const result = await this.model.create(data)
    return result
  }

  async update<A> (id: string, data: A): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, this.updateOption)
  }

  async updateDirectory (id: string, directory: string[]): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, { directory }, this.updateOption)
  }

  async updateOrder (id: string, order: number): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, { order }, this.updateOption)
  }

  async remove (id: string): Promise<T | null> {
    return await this.model.findByIdAndRemove(id)
  }

  async info (id: string): Promise<T | null> {
    return await this.model.findById(id)
  }

  async list<A> (filter: A): Promise<T[]> {
    const list = await this.model.find(filter).sort({
      _id: -1
    })
    list.sort(this.sortMethod)
    return list
  }

  async listPage<A> (page: number, pagesize: number, filter: A): Promise<TypesBase.IResponePageBodyType<T>> {
    const start = (page - 1) * pagesize
    const total = await this.model.find(filter).count()
    const list: T[] = await this.model.find(filter).skip(start).limit(pagesize).sort({
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

  async copy (id: string, directory: string[] = [], copyFields: Function): Promise<boolean> {
    try {
      const info = await this.model.findById(id) as TypesBase.IBaseFieldsType
      const oldDirectory = info ? [...info.directory] : []

      const list = await this.model.find({
        $or: [{
          _id: id
        }, {
          directory: { // 数组包含某个元素
            $elemMatch: {
              $eq: id
            }
          }
        }]
      })

      let _list: any[] = []
      list.map(item => {
        const _id = item._id.toString()
        const _item = {
          ...item.toJSON(),
          _id: this.createObjectId().toString(),
          oldId: _id
        }
        _list.push(_item)
        return item
      })
      const folders = _list.filter(item => item.type === TypesBase.IBaseTypesType.FOLDER)
      const char = '|||'
      _list = _list.map(item => {
        let _directory = item.directory.join(char)
        const _oldDirectory = oldDirectory.join(char)
        const __directory = directory.join(char)
        _directory = _oldDirectory ? _directory.replace(_oldDirectory, __directory) : `${__directory}${char}${_directory}`
        folders.map(folder => {
          _directory = _directory.replace(folder.oldId, folder._id)
        })
        item.directory = _directory.split(char)
        item.directory = item.directory.filter((sub: any) => Boolean(sub))
        return item
      })
      
      if (typeof copyFields === 'function') {
        for (const itemData of _list) {
          const _itemData = copyFields(itemData)
          await this.model.create(_itemData)
        }
      }
      
      return true
    } catch (_) {
      return false
    }
  }

  async move (id: string, directory: string[] = []): Promise<boolean> {
    try {
      const info = await this.model.findById(id) as TypesBase.IBaseFieldsType
      const oldDirectory = info ? [...info.directory] : []

      const list: any[] = await this.model.find({
        $or: [{
          _id: id
        }, {
          directory: { // 数组包含某个元素
            $elemMatch: {
              $eq: id
            }
          }
        }]
      }, '_id directory')

      const char = '|||'
      const _list: { _id: string, directory: string[]}[] = list.map(item => {
        const _id = item._id.toString()
        let _directory = item.directory.join(char)
        _directory = _directory.replace(oldDirectory.join(char), directory.join(char))
        _directory = _directory.replace(/^\|\|\|/, '')
        const newDirectory = _directory ? _directory.split(char) : []
        return {
          _id,
          directory: newDirectory
        }
      })
      
      for (const itemData of _list) {
        await this.model.findByIdAndUpdate(itemData._id, { directory: [...itemData.directory] }, this.updateOption)
      }
      
      return true
    } catch (_) {
      return false
    }
  }

  dayjs = dayjs

  updateOption = { 
    new: true, 
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true, 
    findByIdAndUpdate: 'after' 
  }

  createObjectId = () => {
    return new Types.ObjectId()
  }

  toObjectId (id: string): Types.ObjectId {
    return new Types.ObjectId(id)
  }

  sortMethod = ($a: unknown, $b: unknown): 1 | -1 => {
    const a = $a as TypesBase.IBaseFieldsType
    const b = $b as TypesBase.IBaseFieldsType
    if (a.type === b.type) {
      if (a.order === b.order) {
        const _a = a.title.charCodeAt(0)
        const _b = b.title.charCodeAt(0)
        return _a - _b > 0 ? 1 : -1
      } else {
        return a.order > b.order ? 1 : -1
      }
    } else {
      return a.type === TypesBase.IBaseTypesType.FILE ? 1 : -1
    }
  }

}
export default BaseController
