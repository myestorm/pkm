import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [{
  path: '/',
  name: 'Home',
  component: () => import('../views/Home.vue'),
  meta: {
    icon: 'signin',
    keepAlive: false
  }
}, {
  path: '/document/:cid/:id?',
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
