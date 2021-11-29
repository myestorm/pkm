import { AppRouter } from '../core/router'
import Home from './home'
import User from './user'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(User)

export default appRouter.router
