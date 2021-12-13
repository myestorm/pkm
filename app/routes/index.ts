import { AppRouter } from '../core/router'
import Home from './home'
import User from './user'
import Api from './api'
import File from './file'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(User)
  .mount(Api)
  .mount(File)

export default appRouter.router
