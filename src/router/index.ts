import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

export const authorizeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home',
    component: () => import('../components/layout/layout.vue'),
    meta: {
      icon: 'home',
      keepAlive: false
    },
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('../views/home.vue'),
      meta: {
        icon: 'home',
        keepAlive: false
      }
    }, {
      path: '/document/:kid/:did?',
      name: 'Document',
      component: () => import('../views/document/document.vue'),
      meta: {
        icon: 'document',
        keepAlive: false
      }
    }, {
      path: '/book',
      name: 'Book',
      component: () => import('../views/book/index.vue'),
      meta: {
        icon: 'book',
        keepAlive: false
      }
    }, {
      path: '/userinfo',
      name: 'Userinfo',
      component: () => import('../views/user/userinfo.vue'),
      meta: {
        icon: 'userinfo',
        keepAlive: false
      }
    }]
  }
]

const routes: RouteRecordRaw[] = [{
  path: '/signin',
  name: 'UserSignin',
  component: () => import('../views/user/signin.vue'),
  meta: {
    icon: 'signin',
    keepAlive: false
  }
}, {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('../views/error/404.vue'),
  meta: {
    icon: 'error',
    keepAlive: false
  }
}]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
