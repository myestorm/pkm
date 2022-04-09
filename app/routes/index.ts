import { AppRouter } from '../core/router'
import Home from './home'
import File from './file'
import Admin from './admin'
import Document from './document'
import Book from './book'

const appRouter = new AppRouter()
appRouter
  .mount(Home)
  .mount(File)
  .mount(Admin)
  .mount(Document)
  .mount(Book)

export default appRouter.router
