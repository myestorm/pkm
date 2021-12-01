import { axios } from '../plugins/axios'

import { IResponeBodyType, IResponePageBodyType } from '../../app/types/index'
import { IDocumentListItemType } from '../../app/types/document'

// 获取所有文档列表分页
export const ApiDocuments = (): Promise<IResponeBodyType<IResponePageBodyType<IDocumentListItemType>>> => {
  return axios.get('/api/documents')
}
