import { createRouter, createWebHistory, Router, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import * as TypesBase from '@/types/base'

import useStore from '@/store/index'
import useAdminStore from '@/store/admin/index'

// import useNavigationStore from '@/store/modules/navigation/index'

// import { breadcrumbType } from '@/store/modules/navigation/types'

import def from './default/index'
import mobile from './mobile/index'


import signin from '@/views/base/signin.vue'
import error404 from '@/views/base/error404.vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

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

export const authorizeRoutes: RouteRecordRaw[] = [
  def,
  mobile
]

// get root menu
let isInitialized = false
const defNav: TypesBase.INavigationType[] = []
const mobileNav: TypesBase.INavigationType[] = []
authorizeRoutes.map(item => {
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
        defNav.push(_item)
      }
    }
  })
  return item
})

const findIndex = (_path: string): { type: string, index: number } => {
  const inMobile = /^\/m/.test(_path)
  const res = {
    type: 'def',
    index: -1
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
  } else {
    res.type = 'def'
    for (let i = 0; i < defNav.length; i++) {
      const reg = new RegExp(`^${defNav[i].url}`, 'gmi')
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
  const breadcrumbs: TypesBase.INavigationType[] = []
  const store = useStore()
  matched.map(item => {
    if (item.path !== '/' && !item.redirect) {
      const title = (item.meta.title || '') as string
      const icon = (item.meta.icon || '') as string
      breadcrumbs.push({
        title,
        url: item.path,
        icon
      })
    }
    return item
  })
  store.breadcrumbs = breadcrumbs

  // nav
  if (!isInitialized) {
    store.navigation = defNav
    store.mobile.navigation = mobileNav
    isInitialized = true
  }

  // set nav current
  const _path = route.path
  const current = findIndex(_path)
  if (current.type === 'mobile') {
    store.mobile.currentNav = current.index
  } else {
    store.currentNav = current.index
  }

  // change page title
  const pageTitle = (route.meta.title || '') as string
  const sitename = store.sitename
  document.title = pageTitle ? `${pageTitle} - ${sitename}` : sitename
}

// 动态加载路由
const addRoute = () => {
  authorizeRoutes.forEach(item => {
    router.addRoute(item)
  })
}

let isMounted = false
// 动态挂载路由
const mountAuthorizeRoutes = () => {
  return new Promise<{ isSuccess: boolean, url: string }>((resolve) => {
    const store = useStore()
    const storeAdmin = useAdminStore()
    const isMobile = store.system.isMobile
    const defaultHome = isMobile ? '/m/home' : '/home'
    let _pathName = window.location.pathname
    let pathName = _pathName
    if (!pathName || pathName === '/' || /^\/signin/.test(pathName)) {
      pathName = defaultHome
    }
    const fullPath = pathName + window.location.search

    storeAdmin.fetchuserinfo().then((data) => {
      const token = data.token
      if (token) {
        addRoute()
        resolve({
          isSuccess: true,
          url: fullPath
        })
      } else {
        resolve({
          isSuccess: false,
          url: fullPath
        })
      }
    }).catch(() => {
      resolve({
        isSuccess: false,
        url: fullPath
      })
    }).finally(() => {
      isMounted = true
    })
  })
}

router.beforeEach((to, from, next) => {
  if (!isMounted) {
    mountAuthorizeRoutes().then(res => {
      const { isSuccess, url } = res
      if (isSuccess) {
        router.push(url)
      } else {
        if(to.path !== '/signin') {
          router.push({
            path: '/signin',
            query: {
              refer: encodeURIComponent(url)
            }
          })
        }
      }
    }).finally(() => {
      next()
    })
  } else {
    setNavigation(to)
    NProgress.start()
    next()
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
