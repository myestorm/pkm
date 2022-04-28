import empty from '@/components/layout/empty.vue'
import mobileHome from '@/views/mobile/home.vue'

import mobileDocument from '@/views/mobile/document.vue'
import mobileDocumentEditor from '@/views/mobile/document/editor.vue'

import mobileBook from '@/views/mobile/book.vue'
import mobileSetting from '@/views/mobile/setting.vue'
import mobileBookEditor from '@/views/mobile/book-editor.vue'
import mobileBookInfo from '@/views/mobile/book-info.vue'
import mobileAdmin from '@/views/mobile/admin.vue'

const prefix = '/m'

export default {
  path: prefix,
  name: 'MobileIndex',
  redirect: `${prefix}/home`,
  component: empty,
  meta: {
    title: '首页',
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: `${prefix}/home`,
    name: 'MobileHome',
    component: mobileHome,
    meta: {
      title: '首页',
      icon: 'icon-home',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/document/editor/:id`,
    name: 'MobileDocumentEditor',
    component: mobileDocumentEditor,
    meta: {
      title: '文档编辑',
      icon: 'markdown',
      keepAlive: false
    }
  }, {
    path: `${prefix}/document/:path*`,
    name: 'MobileDocument',
    component: mobileDocument,
    meta: {
      title: '文档',
      icon: 'icon-file',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/book`,
    name: 'MobileBook',
    component: mobileBook,
    meta: {
      title: '书架',
      icon: 'icon-bookmark',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/setting`,
    name: 'MobileSetting',
    component: mobileSetting,
    meta: {
      title: '设置',
      icon: 'icon-settings',
      nav: true,
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/editor/:id?`,
    name: 'MobileBookEditor',
    component: mobileBookEditor,
    meta: {
      title: '书籍编辑',
      icon: 'bookEditor',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/info/:id?`,
    name: 'MobileBookInfo',
    component: mobileBookInfo,
    meta: {
      title: '书籍信息',
      icon: 'bookInfo',
      keepAlive: false
    }
  }, {
    path: `${prefix}/admin`,
    name: 'MobileAdmin',
    component: mobileAdmin,
    meta: {
      title: '用户管理',
      icon: 'manage',
      keepAlive: false
    }
  }]
}