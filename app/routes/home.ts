import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'
import path from 'path'
import ejs from 'ejs'

import { ISigninType, IAdminUserType } from '../types/admin'
import { IResponeBodyType } from '../types/index'
import Admin from '../controllers/admin'

const admin = new Admin()

@prefix('')
export default class Home {

  @get('/')
  async Index (ctx: Context, next: Next) {
    const filePath = path.join(__dirname, '../../dist/index.html')
    const template = ejs.fileLoader(filePath).toString()
    const html = ejs.render(template, {})
    ctx.body = html
    await next()
  }

  @post('/signin')
  async Signin (ctx: Context, next: Next) {
    const { jwtSecret = '', cookieToken } = ctx.state.config
    const _body = <ISigninType>ctx.request.body
    const token = await admin.signin(_body, jwtSecret)
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: ''
    }
    if (token) {
      body.data = token
      ctx.cookies.set(cookieToken, token, {
        maxAge: new Date().getTime() + 24 * 60 * 60 * 1000 * 7,
        signed: true,
        httpOnly: true
      })
    } else {
      body.code = 1
      body.msg = 'signin fail'
    }
    ctx.body = body
    await next()
  }

  @post('/signup')
  async Signup (ctx: Context, next: Next) {
    const _body = <IAdminUserType>ctx.request.body
    await admin.add(_body)
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: ''
    }
    ctx.body = body
    await next()
  }

}
