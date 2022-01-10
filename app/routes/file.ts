import { Context, Next } from 'koa'
import { prefix, post } from '../core/router'
import path from 'path'
import { File as FileType } from 'formidable'
import { IResponeBodyType, IFileUploadType } from '../../types/index'


@prefix('/api/file')
export default class File {

  @post('/upload')
  async Upload (ctx: Context, next: Next) {
    const file = ctx.request?.files?.file as unknown as FileType
    if (file) {
      let filepath = path.relative(path.join(__dirname, '../../resource/uploads/'), file.path)
      filepath = path.join('uploads/', filepath)
      filepath = filepath.replace(/\\/g, '/')
      const body: IResponeBodyType<IFileUploadType> = {
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
