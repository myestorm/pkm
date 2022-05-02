import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

import * as TypesBase from '../types/base'
import * as TypesAdmin from '../types/admin'

import Admin from '../controllers/admin'

const admin = new Admin()

@prefix('/api')
export default class User {

  @post('/signin')
  async Signin (ctx: Context, next: Next) {
    const { jwtSecret = '', cookieToken } = ctx.state.config
    const _body = ctx.request.body as TypesAdmin.IAdminSigninType
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

  @get('/userinfo')
  async Userinfo (ctx: Context, next: Next) {
    const { userinfo, token } = ctx.state
    const body: TypesBase.IResponeBodyType<TypesAdmin.IAdminContextUserType> = {
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

  @post('/password')
  async Password (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const id = userinfo.id as string
    const _body = ctx.request.body as TypesAdmin.IAdminChangePasswordType
    if (id && _body.password && _body.oldPassword && _body.repeatPassword && _body.password === _body.repeatPassword) {
      const info = await admin.findOne({
        _id: admin.methods.toObjectId(id),
        password: admin.methods.md5(_body.oldPassword),
        status: 1
      })
      if (info && info._id.toString() === id) {
        await admin.updateAdmin(id, { password: _body.password })
        ctx.body = {
          code: 0,
          msg: 'success',
          data: id
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

  @post('/update')
  async Update (ctx: Context, next: Next) {
    const { userinfo } = ctx.state
    const id = userinfo.id as string
    if (id) {
      const info = await admin.infoAdmin(id)
      if (info && info._id.toString() === id) {
        const _body = ctx.request.body as TypesAdmin.IAdminChangeAccountInfoType
        const data = admin.methods.clearUnnecessaryFields(_body, ['avatar', 'nickname', 'mobile', 'email'])
        await admin.updateAdmin(id, data)
        ctx.body = {
          code: 0,
          msg: 'success',
          data: id
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

  @post('/admin/create')
  async AdminCreate (ctx: Context, next: Next) {
    const _body = ctx.request.body as TypesAdmin.IAdminCreateType
    const info = await admin.checkUnique({
      username: _body.username
    })
    if (!info) {
      const data = admin.methods.clearUnnecessaryFields(_body, ['username', 'password', 'avatar', 'nickname', 'mobile', 'email'])
      const result = await admin.createAdmin(data)
      const body: TypesBase.IResponeBodyType<string> = {
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

  @get('/admin/list')
  async AdminList (ctx: Context, next: Next) {
    const list = await admin.listAdmin()
    const body: TypesBase.IResponeBodyType<TypesAdmin.IAdminType[]> = {
      code: 0,
      msg: 'success',
      data: list
    }
    ctx.body = body
    await next()
  }

  @get('/admin/reset/password/:id')
  async AdminResetPassword (ctx: Context, next: Next) {
    const { id = '' } = ctx.params
    if (id) {
      const _result = await admin.infoAdmin(id)
      if (_result && _result._id) {
        const _p = 'totonoo!234%'
        const password = admin.methods.md5(admin.methods.md5(_p))
        await admin.updateById(id, { password })
        const body: TypesBase.IResponeBodyType<string> = {
          code: 0,
          msg: 'success',
          data: _p
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

  @get('/admin/disabled/:id/:status')
  async AdminDisabled (ctx: Context, next: Next) {
    const { id = '', status } = ctx.params
    if (id && (Number(status) === 0 || Number(status) === 1)) {
      const _result = await admin.infoAdmin(id)
      if (_result && _result._id) {
        let _status = Number(status)
        _status = _status === 0 ? 0 : 1
        await admin.updateById(id, { status: _status })
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
