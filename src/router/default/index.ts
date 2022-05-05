import layout from '@/components/layout/layout.vue'

import home from '@/views/default/home.vue'
import document from '@/views/default/document.vue'
import book from '@/views/default/book.vue'
import setting from '@/views/default/setting.vue'
import filelist from '@/views/default/filelist.vue'

export default {
  path: '/',
  name: 'Index',
  redirect: '/home',
  component: layout,
  meta: {
    title: '首页',
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: '/home',
    name: 'Home',
    component: home,
    meta: {
      title: '首页',
      icon: 'home',
      keepAlive: false
    }
  }, {
    path: '/document/:path*',
    name: 'Document',
    component: document,
    meta: {
      title: '文档',
      icon: 'icon-file',
      nav: true,
      keepAlive: false
    }
  }, {
    path: '/book/:path*',
    name: 'Book',
    component: book,
    meta: {
      title: '书架',
      icon: 'icon-bookmark',
      nav: true,
      keepAlive: false
    }
  }, {
    path: '/setting',
    name: 'Setting',
    component: setting,
    meta: {
      title: '设置',
      icon: 'icon-setting',
      nav: false,
      keepAlive: false
    }
  }, {
    path: '/filelist',
    name: 'Filelist',
    component: filelist,
    meta: {
      title: '文件管理',
      icon: 'icon-storage',
      nav: false,
      keepAlive: false
    }
  }]
}
