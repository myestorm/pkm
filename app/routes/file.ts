import * as Formidable from 'formidable'
import * as TypesBase from '../types/base'

import { Context, Next } from 'koa'
import { prefix, post } from '../core/router'
import path from 'path'
import getRootDir from '../utils/getRootDir'

const rootDir = getRootDir()


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

}
