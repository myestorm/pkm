import empty from '@/components/layout/empty.vue'
import home from '@/views/mobile/home.vue'
import document from '@/views/mobile/document.vue'
import book from '@/views/mobile/book.vue'
import setting from '@/views/mobile/setting.vue'
import admin from '@/views/mobile/admin.vue'

const prefix = '/m'
export default {
  path: prefix,
  name: 'MIndex',
  redirect: `${prefix}/home`,
  component: empty,
  meta: {
    title: '首页',
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: `${prefix}/home`,
    name: 'MHome',
    component: home,
    meta: {
      title: '首页',
      icon: 'icon-home',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/document/:path*`,
    name: 'MobileDocument',
    component: document,
    meta: {
      title: '文档',
      icon: 'icon-file',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/:path*`,
    name: 'MobileBook',
    component: book,
    meta: {
      title: '书架',
      icon: 'icon-bookmark',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/setting`,
    name: 'MobileSetting',
    component: setting,
    meta: {
      title: '设置',
      icon: 'icon-settings',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/admin`,
    name: 'MobileAdmin',
    component: admin,
    meta: {
      title: '用户管理',
      icon: 'manage',
      nav: false,
      keepAlive: false
    }
  }]
}
