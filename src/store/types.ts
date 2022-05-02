import * as TypesBase from '@/types/base'

export type CommonState = {
  sitename: string,
  system: {
    userAgent: string,
    isMobile: boolean
  },
  theme: string,
  breadcrumbs: TypesBase.INavigationType[],
  navigation: TypesBase.INavigationType[],
  currentNav: number,
  mobile: {
    breadcrumbs: TypesBase.INavigationType[],
    navigation: TypesBase.INavigationType[],
    currentNav: number,
  }
}
