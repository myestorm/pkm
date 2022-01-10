import { AppRouter } from '../core/router'
import Home from './home'
import Admin from './admin'
import Knowledge from './knowledge'
import Recycle from './recycle'
import File from './file'
import Bookrack from './bookrack'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(Admin)
  .mount(Knowledge)
  .mount(Recycle)
  .mount(File)
  .mount(Bookrack)

export default appRouter.router
