import { Context, Next } from 'koa'
import jwt, { Jwt } from 'jsonwebtoken'

export interface IOptionsType {
  blackList: string[]
}

export default (options: IOptionsType = {
  blackList: []
}) => {
  const checkInBlackList = (url: string): boolean => {
    let isIn = false
    for (let i = 0; i < options.blackList.length; i++) {
      const item = options.blackList[i]
      const reg = new RegExp(item)
      if (reg.test(url)) {
        isIn = true
        break
      }
    }
    return isIn
  }
  return async (ctx: Context, next: Next) => {
    // 是否需要验证权限
    const isInBlackList = checkInBlackList(ctx.request.url)
    if (isInBlackList) {
      if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ')
        if (parts.length === 2) {
          const scheme = parts[0]
          const token = parts[1]
          if (/^Bearer$/i.test(scheme)) {
            const { jwtSecret = '' } = ctx.state.config
            try {
              const verifyInfo = <Jwt>jwt.verify(token, jwtSecret, {
                complete: true
              })
              ctx.state.userinfo = verifyInfo.payload || {}
              ctx.state.token = token || ''
            } catch (error) {
              ctx.throw(401)
            }
          } else {
            ctx.throw(401)
          }
        } else {
          ctx.throw(401)
        }
      } else {
        ctx.throw(401)
      }
    }
    await next()
  }
}
