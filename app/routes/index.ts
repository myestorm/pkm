import { AppRouter } from '../core/router'
import Home from './home'
import User from './user'
import Api from './api'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(User)
  .mount(Api)

export default appRouter.router
