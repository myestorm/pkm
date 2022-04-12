export interface breadcrumbType {
  url: string,
  title: string,
  icon?: string
}
export type NavigationState = {
  sitename: string,
  breadcrumbs: breadcrumbType[],
  pcNav: breadcrumbType[],
  mobileNav: breadcrumbType[],
  pcCurrent: number,
  mobileCurrent: number
}