import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [{
  path: '/',
  name: 'Home',
  component: () => import('../views/Home.vue'),
  meta: {
    icon: 'signin',
    keepAlive: false
  }
}]

const router: Router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
