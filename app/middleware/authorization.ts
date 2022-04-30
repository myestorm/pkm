import { Context, Next } from 'koa'
import jwt, { Jwt } from 'jsonwebtoken'
import minimatch from 'minimatch'

export interface IOptionsType {
  blackList: string[],
  whiteList: string[],
}

const checkInList = (url: string, list: string[]): boolean => {
  let isIn = false
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const isMatch = minimatch(url, item)
    if (isMatch) {
      isIn = true
      break
    }
  }
  return isIn
}

export default (options: IOptionsType = {
  blackList: [],
  whiteList: [],
}) => {
  return async (ctx: Context, next: Next) => {
    // 是否需要验证权限
    const url = ctx.request.url
    const isInBlackList = checkInList(url, options.blackList)
    const isInWhiteList = checkInList(url, options.whiteList)
    if (isInBlackList && !isInWhiteList) {
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
