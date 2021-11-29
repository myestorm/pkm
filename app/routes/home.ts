import { Context, Next } from 'koa'
import { prefix, get, post } from '../core/router'

@prefix('')
export default class Home {
  @get('/')
  async Index (ctx: Context, next: Next) {
    // const filePath = path.join(__dirname, '../templates/pages/index.html')
    // const template = ejs.fileLoader(filePath).toString();
    // const html = ejs.render(template, {});
    // ctx.body = html;
    // console.log(ctx.render)
    // await ctx.render('pages/index', {
    //   title: 111111
    // });
    ctx.body = '123';
  }
}
