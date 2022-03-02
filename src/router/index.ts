import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
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

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})

export default router
