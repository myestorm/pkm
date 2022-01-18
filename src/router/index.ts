import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

import layout from '../components/layout/layout.vue'
import home from '../views/home.vue'
import document from '../views/document/document.vue'
import bookIndex from '../views/book/index.vue'
import bookInfo from '../views/book/info.vue'
import userinfo from '../views/user/userinfo.vue'
import signin from '../views/user/signin.vue'
import error404 from '../views/error/404.vue'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false }) 

export const authorizeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home',
    component: layout,
    meta: {
      icon: 'home',
      keepAlive: false
    },
    children: [{
      path: '/home',
      name: 'Home',
      component: home,
      meta: {
        icon: 'home',
        keepAlive: false
      }
    }, {
      path: '/document/:kid/:did?',
      name: 'Document',
      component: document,
      meta: {
        icon: 'document',
        keepAlive: false
      }
    }, {
      path: '/book',
      name: 'Book',
      component: bookIndex,
      meta: {
        icon: 'book',
        keepAlive: false
      }
    }, {
      path: '/book/info/:groupId/:id',
      name: 'BookInfo',
      component: bookInfo,
      meta: {
        icon: 'book-info',
        keepAlive: false
      }
    }, {
      path: '/userinfo',
      name: 'Userinfo',
      component: userinfo,
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

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
