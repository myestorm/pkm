import Koa from 'koa'
import { Context, Next } from 'koa'
const app = new Koa()

app.use(async (ctx: Context, next: Next) => {
  ctx.body = 'index1111 asdas'
  await next()
})

app.listen(4000, () => {
  console.log('application is running on port 4000')
})
