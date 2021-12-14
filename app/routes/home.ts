import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'
import path from 'path'
import ejs from 'ejs'

@prefix('')
export default class Home {
  @get('/')
  async Index (ctx: Context, next: Next) {
    const filePath = path.join(__dirname, '../../dist/index.html')
    const template = ejs.fileLoader(filePath).toString()
    const html = ejs.render(template, {})
    ctx.body = html
  }
}
