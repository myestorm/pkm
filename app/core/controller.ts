import { Types, Model, UnpackedIntersection } from 'mongoose'
import dayjs from 'dayjs'
import { MD5 } from 'crypto-js'

import * as TypesBase from '../types/base'

class BaseController<T> {
  model: Model<T>
  
  constructor (model: Model<T>) {
    this.model = model
  }

  async create<A> (data: A): Promise<T> {
    const result = await this.model.create(data)
    return result
  }

  async updateById<A> (id: string, data: A): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, this.options.update)
  }

  async remove (id: string): Promise<T | null> {
    return await this.model.findByIdAndRemove(id)
  }

  async info (id: string, populate = true,): Promise<UnpackedIntersection<T, {}> | T | null> {
    const result = populate ? await this.model.findById(id).populate(this.options.directoryPopulate) : await this.model.findById(id)
    return result
  }

  async findOne<A> (condition: A): Promise<T | null> {
    const result = await this.model.findOne(condition)
    return result
  }

  async search (keyword: string, directory: string[] = []): Promise<T[]> {
    const reg = new RegExp(keyword, 'gmi')
    const and = []
    and.push({
      type: TypesBase.IBaseTypesType.FILE
    })
    if (directory.length > 0) {
      and.push({
        directory: {
          $all: directory
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
    const list = await this.model.find(params, '_id title directory tags cover desc type').populate(this.options.directoryPopulate).sort({
      _id: -1
    })
    list.sort(this.methods.sort)
    return list
  }

  // 通过ID批量查询数据
  async batchQueryByIds (ids: string[]): Promise<T[]> {
    const list = await this.model.find({
      _id: {
        $in: ids
      }
    }).populate(this.options.directoryPopulate)
    return list
  }

  async list<A> (filter: A): Promise<T[]> {
    const list = await this.model.find(filter).populate(this.options.directoryPopulate).sort({
      _id: -1
    })
    list.sort(this.methods.sort)
    return list
  }

  async listPage<A> (page: number, pagesize: number, filter: A, populate = true, sort = true): Promise<TypesBase.IResponePageType<T>> {
    const start = (page - 1) * pagesize
    const total = await this.model.find(filter).count()
    const list: T[] = populate ? await this.model.find(filter).populate(this.options.directoryPopulate).skip(start).limit(pagesize).sort({
      _id: -1
    }) : await this.model.find(filter).skip(start).limit(pagesize).sort({
      _id: -1
    })
    if (sort) {
      list.sort(this.methods.sort)
    }
    const res = {
      list,
      page,
      pagesize,
      total
    }
    return res
  }

  async countChildren (id: string): Promise<number> {
    const total = await this.model.find({
      directory: {
        $in: [id]
      }
    }).count()
    return total
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
          _id: this.methods.createObjectId().toString(),
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
        await this.model.findByIdAndUpdate(itemData._id, { directory: [...itemData.directory] }, this.options.update)
      }
      
      return true
    } catch (_) {
      return false
    }
  }

  options = {
    directoryPopulate: {
      path: 'directoryList',
      select: '_id title directory type cover desc tags'
    },
    update: { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true, 
      findByIdAndUpdate: 'after' 
    }
  }

  methods = {
    dayjs: dayjs,

    md5: (str: string) => {
      return MD5(str).toString()
    },

    // 创建ObjectID
    createObjectId: () => {
      return new Types.ObjectId()
    },

    // 字符转ObjectID
    toObjectId: (id: string): Types.ObjectId => {
      return new Types.ObjectId(id)
    },

    // 通用排序
    sort: ($a: unknown, $b: unknown): 1 | -1 => {
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
    },

    // 清理非必要字段
    clearUnnecessaryFields: <A>(data: A, fields: (keyof A)[]): A => {
      const res: A = {} as A
      fields.map(key => {
        res[key] = data[key]
      })
      return res
    }

  }

}
export default BaseController
