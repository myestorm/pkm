import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

import { ISigninType, IAdminUserType, IUserInfoType } from '../types/admin'
import { IResponeBodyType } from '../types/index'
import Admin from '../controllers/admin'

const admin = new Admin()

@prefix('/user')
export default class User {

  @get('/info')
  async Userinfo (ctx: Context, next: Next) {
    const { userinfo, token } = ctx.state
    const body: IResponeBodyType<IUserInfoType> = {
      code: 0,
      msg: 'success',
      data: {
        userinfo,
        token
      }
    }
    ctx.body = body
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
      body.msg = '登录失败，请检查登录信息是否正确！'
    }
    ctx.body = body
    await next()
  }

  @get('/signout')
  async Signout (ctx: Context, next: Next) {
    const { cookieToken } = ctx.state.config
    const body: IResponeBodyType<string> = {
      code: 0,
      msg: 'success',
      data: ''
    }
    ctx.cookies.set(cookieToken, null, {
      maxAge: new Date().getTime() - 1000,
      signed: true,
      httpOnly: true
    })
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
