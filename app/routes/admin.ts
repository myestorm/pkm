import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

import * as TypesBase from '../types/base'
import * as TypesAdmin from '../types/admin'

import Admin from '../controllers/admin'

const admin = new Admin()

@prefix('/admin')
export default class User {

  @get('/info')
  async Admininfo (ctx: Context, next: Next) {
    const { userinfo, token } = ctx.state
    const body: TypesBase.IResponeBodyType<TypesAdmin.IUserInfoType> = {
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
    const _body = ctx.request.body as TypesAdmin.ISigninType
    const token = await admin.signin(_body, jwtSecret)
    const body: TypesBase.IResponeBodyType<string> = {
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
    const body: TypesBase.IResponeBodyType<string> = {
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

  @get('/list')
  async AdminList (ctx: Context, next: Next) {
    const list = await admin.list({})
    const body: TypesBase.IResponeBodyType<TypesAdmin.IAdminType[]> = {
      code: 0,
      msg: 'success',
      data: list
    }
    ctx.body = body
    await next()
  }

  @post('/add')
  async AdminAdd (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const _body = ctx.request.body as TypesAdmin.IAdminAddType
    const info = await admin.checkUnique('username', _body.username)
    if (!info) {
      const result = await admin.add(_body)
      const body: TypesBase.IResponeBodyType<TypesAdmin.IAdminType> = {
        code: 0,
        msg: 'success',
        data: result
      }
      ctx.body = body
    } else {
      ctx.body = {
        code: 1,
        msg: '用户名已经存在'
      }
    }
    await next()
  }

  @get('/reset/password/:id')
  async AdminResetPassword (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const { id = '' } = ctx.params
    if (id) {
      const _result = await admin.info(id)
      if (_result && _result._id) {
        const updatedBy = userinfo._id
        const result = await admin.resetPassword(id, updatedBy)
        const body: TypesBase.IResponeBodyType<string> = {
          code: 0,
          msg: 'success',
          data: result
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

  @get('/disabled/:id/:status')
  async AdminDisabled (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const { id = '', status } = ctx.params
    if (id && (Number(status) === 0 || Number(status) === 1)) {
      const _result = await admin.info(id)
      if (_result && _result._id) {
        const updatedBy = userinfo._id
        let _status = Number(status)
        _status = _status === 0 ? 0 : 1
        const result = await admin.disabled(id, _status, updatedBy)
        const body: TypesBase.IResponeBodyType<string> = {
          code: 0,
          msg: 'success',
          data: result
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

  @post('/self/password')
  async AdminSelfPassword (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const id = userinfo._id as string
    const _body = ctx.request.body as TypesAdmin.IAdminUpdateSelfPasswordType
    if (id && _body.password && _body.oldPassword && _body.repeatPassword && _body.password === _body.repeatPassword) {
      const info = await admin.infoCondition({
        _id: admin.toObjectId(id),
        password: _body.oldPassword,
        status: 1
      })
      console.log(_body, info)
      if (info && info._id.toString() === id) {
        const result = await admin.updateSelfPassword(id, _body.password)
        ctx.body = {
          code: 0,
          msg: 'success',
          data: result
        }
      } else {
        ctx.body = {
          code: 2,
          msg: '状态异常，请重新登录'
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

  @post('/self/info')
  async AdminSelfInfo (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const id = userinfo._id as string
    if (id) {
      const info = await admin.info(id)
      if (info && info._id.toString() === id) {
        const _body = ctx.request.body as TypesAdmin.IAdminUpdateSelfInfoType
        const _postData: TypesAdmin.IAdminUpdateSelfInfoType = {
          avatar: _body.avatar,
          nickname: _body.nickname,
          email: _body.email,
          mobile: _body.mobile
        }
        const result = await admin.updateSelf(id, _postData)
        ctx.body = {
          code: 0,
          msg: 'success',
          data: result
        }
      } else {
        ctx.body = {
          code: 2,
          msg: '状态异常，请重新登录'
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '请先登录'
      }
    }
    await next()
  }

}
