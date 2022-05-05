import * as Formidable from 'formidable'
import { Context, Next } from 'koa'
import path from 'path'
import fs from 'fs'
import compressing from 'compressing'

import * as TypesBase from '../types/base'
import { prefix, post, del } from '../core/router'
import getRootDir from '../utils/getRootDir'

import  * as TypesFile from '../types/file'
import FileController from '../controllers/file'

const rootDir = getRootDir()
const htmlRoot = path.join(rootDir, 'resource/html')
const fileController = new FileController()

function delFile (filepath: string) {
  if (fs.existsSync(filepath)) {
    if (fs.statSync(filepath).isDirectory()) {
      const files = fs.readdirSync(filepath)
      files.forEach((file, index) => {
        let currentPath = filepath + '/' + file
        if (fs.statSync(currentPath).isDirectory()) {
          delFile(currentPath)
        } else {
          fs.unlinkSync(currentPath)
        }
      })
      fs.rmdirSync(filepath)
    } else {
      fs.unlinkSync(filepath)
    }
  }
}

@prefix('/api/file')
export default class File {

  @post('/upload')
  async Upload (ctx: Context, next: Next) {
    const file = ctx.request?.files?.file as unknown as Formidable.File
    if (file) {
      let filepath = path.relative(path.join(rootDir, 'resource/uploads/'), file.filepath)
      filepath = path.join('uploads/', filepath)
      filepath = filepath.replace(/\\/g, '/')
      const body: TypesBase.IResponeBodyType<TypesBase.IFileUploadType> = {
        code: 0,
        msg: 'success',
        data: {
          domain: '/',
          filepath
        }
      }
      ctx.body = body
    } else {
      ctx.body = {
        code: 1,
        msg: '上传失败'
      }
    }
    await next()
  }

  @post('/unzip')
  async Unzip (ctx: Context, next: Next) {
    const file = ctx.request?.files?.file as unknown as Formidable.File
    const id = fileController.methods.createObjectId().toString()
    const directory = (ctx.request.body.directory || id) as string
    if (file) {
      const filepath = file.filepath
      const obj = path.parse(filepath)
      if (obj.ext !== '.zip') {
        fs.unlinkSync(filepath)
        ctx.body = {
          code: 2,
          msg: '仅支持zip格式文件'
        }
      } else {
        const folder = path.join(htmlRoot, directory)
        const objTo = path.parse(folder)
        await compressing.zip.uncompress(filepath, folder)
        fs.unlinkSync(filepath)
        const postData = {
          _id: id,
          type: 'unzip',
          filepath: `resource/html/${path.relative(htmlRoot, folder)}`,
          rootpath: 'resource/html',
          base: objTo.base,
          ext: '',
          name: objTo.name
        }
        const result = await fileController.create(postData)
        const body: TypesBase.IResponeBodyType<TypesFile.IFileType> = {
          code: 0,
          msg: 'success',
          data: result
        }
        ctx.body = body
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '上传失败'
      }
    }
    await next()
  }

  @post('/list/page')
  async FileListPage (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesBase.IPageType<TypesFile.IFileQueryType>
    const conditions = _body.conditions
    const result = await fileController.listPage(_body.page, _body.pagesize, conditions, false, false)
    const body: TypesBase.IResponeBodyType<TypesBase.IResponePageType<TypesFile.IFileType>> = {
      code: 0,
      msg: 'success',
      data: result
    }
    ctx.body = body
    await next()
  }

  @del('/remove/:id')
  async FileRemove (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const info = await fileController.info(id, false)
      if (info) {
        const _url = path.join(rootDir, info.filepath)
        delFile(_url)
        await fileController.remove(id)
        const body: TypesBase.IResponeBodyType<string> = {
          code: 0,
          msg: 'success',
          data: id
        }
        ctx.body = body
      } else {
        ctx.body = {
          code: 2,
          msg: '参数不正确'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '参数不正确'
      }
    }
    await next()
  }

}
