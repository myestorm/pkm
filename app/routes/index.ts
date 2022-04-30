import { AppRouter } from '../core/router'
import Admin from './admin'
import Home from './home'
import File from './file'
import Document from './document'
import Book from './book'

const appRouter = new AppRouter()
appRouter
  .mount(Admin)
  .mount(Home)
  .mount(File)
  .mount(Document)
  .mount(Book)

export default appRouter.router
