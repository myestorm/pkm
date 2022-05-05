import BaseController from '../core/controller'
import File from '../models/file'

import  * as TypesFile from '../types/file'

class FileController extends BaseController<TypesFile.IFileModelType> {

  constructor () {
    super(File)
  }

}

export default FileController
