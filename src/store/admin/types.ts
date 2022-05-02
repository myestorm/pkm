import * as TypesBase from '@/types/base'
import * as TypesAdmin from '@/types/admin'

export type AdminState = {
  token: TypesAdmin.IAdminContextUserType['token'],
  userinfo: TypesAdmin.IAdminContextUserType['userinfo']
}