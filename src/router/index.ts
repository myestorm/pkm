import { createRouter, createWebHistory, Router, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import useNavigationStore from '../store/modules/navigation/index'
import { breadcrumbType } from '../store/modules/navigation/types'
import pc from './pc/index'
import mobile from './mobile/index'


import empty from '../components/layout/empty.vue'
import signin from '../views/user/signin.vue'
import error404 from '../views/error/404.vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

export const authorizeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: empty,
    meta: {
      title: '首页',
      icon: 'home',
      keepAlive: false
    },
    children: [
      pc,
      mobile
    ]
  }
]

const routes: RouteRecordRaw[] = [{
  path: '/signin',
  name: 'UserSignin',
  component: signin,
  meta: {
    icon: 'signin',
    keepAlive: false
  }
}, {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: error404,
  meta: {
    icon: 'error',
    keepAlive: false
  }
}]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

// get root menu
let isInitialized = false
const pcNav: breadcrumbType[] = []
const mobileNav: breadcrumbType[] = []
authorizeRoutes[0].children?.map(item => {
  const _path = item.path
  item.children?.forEach(sub => {
    if (sub.meta?.nav) {
      const _url = sub.path.replace(/\/:(.+)/gmi, '')
      const _title = (sub?.meta.title || '') as string
      const _icon = (sub?.meta.icon || '') as string
      const _item = {
        url: _url,
        title: _title,
        icon: _icon
      }
      if (_path === '/m') {
        mobileNav.push(_item)
      } else {
        pcNav.push(_item)
      }
    }
  })
  return item
})

const findIndex = (_path: string): { type: string, index: number } => {
  const inPc = /^\/p/.test(_path)
  const inMobile = /^\/m/.test(_path)
  const res = {
    type: 'pc',
    index: -1
  }
  if (inPc) {
    res.type = 'pc'
    for (let i = 0; i < pcNav.length; i++) {
      const reg = new RegExp(`^${pcNav[i].url}`, 'gmi')
      if (reg.test(_path)) {
        res.index = i
        break
      }
    }
  }
  if (inMobile) {
    res.type = 'mobile'
    for (let i = 0; i < mobileNav.length; i++) {
      const reg = new RegExp(`^${mobileNav[i].url}`, 'gmi')
      if (reg.test(_path)) {
        res.index = i
        break
      }
    }
  }
  return res
}

const setNavigation = (route: RouteLocationNormalized) => {
  const matched = route.matched
  const breadcrumbs: breadcrumbType[] = []
  const storeNavigation = useNavigationStore()
  matched.map(item => {
    if (item.path !== '/' && !item.redirect) {
      const title = (item.meta.title || '') as string
      breadcrumbs.push({
        title,
        url: item.path
      })
    }
    return item
  })
  storeNavigation.breadcrumbs = breadcrumbs

  // nav
  if (!isInitialized) {
    storeNavigation.pcNav = pcNav
    storeNavigation.mobileNav = mobileNav
    isInitialized = true
  }

  // set nav current
  const _path = route.path
  const current = findIndex(_path)
  if (current.type === 'pc') {
    storeNavigation.pcCurrent = current.index
  } else if (current.type === 'mobile') {
    storeNavigation.mobileCurrent = current.index
  }

  // change page title
  const pageTitle = (route.meta.title || '') as string
  const sitename = storeNavigation.sitename
  document.title = pageTitle ? `${pageTitle} - ${sitename}` : sitename
}

router.beforeEach((to, from, next) => {
  setNavigation(to)
  NProgress.start()
  next()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
