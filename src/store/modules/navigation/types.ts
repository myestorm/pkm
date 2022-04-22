export interface breadcrumbType {
  url: string,
  title: string,
  icon?: string
}
export type NavigationState = {
  sitename: string,
  breadcrumbs: breadcrumbType[],
  computerNav: breadcrumbType[],
  mobileNav: breadcrumbType[],
  computerCurrent: number,
  mobileCurrent: number
}