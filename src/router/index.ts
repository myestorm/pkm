import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [{
  path: '/',
  name: 'Home',
  component: () => import('../views/Home.vue'),
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
}]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
