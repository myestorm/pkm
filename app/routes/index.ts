import { AppRouter } from '../core/router'
import Home from './home'
import User from './user'
import Api from './api'
import File from './file'
import Bookrack from './bookrack'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(User)
  .mount(Api)
  .mount(File)
  .mount(Bookrack)

export default appRouter.router
