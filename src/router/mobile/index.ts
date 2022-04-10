import empty from '../../components/layout/empty.vue'
import mobileHome from '../../views/mobile/home.vue'
import mobileFile from '../../views/mobile/file.vue'
import mobileBook from '../../views/mobile/book.vue'
import mobileSetting from '../../views/mobile/setting.vue'
import mobileMrkdown from '../../views/mobile/markdown.vue'
import mobileBookEditor from '../../views/mobile/book-editor.vue'
import mobileBookInfo from '../../views/mobile/book-info.vue'
import mobileAdmin from '../../views/mobile/admin.vue'

const prefix = '/m'

export default {
  path: prefix,
  name: 'MobileIndex',
  redirect: `${prefix}/home`,
  component: empty,
  meta: {
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: `${prefix}/home`,
    name: 'MobileHome',
    component: mobileHome,
    meta: {
      icon: 'home',
      keepAlive: false
    }
  }, {
    path: `${prefix}/file/:path*`,
    name: 'MobileFile',
    component: mobileFile,
    meta: {
      icon: 'file',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book`,
    name: 'MobileBook',
    component: mobileBook,
    meta: {
      icon: 'book',
      keepAlive: false
    }
  }, {
    path: `${prefix}/setting`,
    name: 'MobileSetting',
    component: mobileSetting,
    meta: {
      icon: 'settings',
      keepAlive: false
    }
  }, {
    path: `${prefix}/markdown`,
    name: 'MobileMrkdown',
    component: mobileMrkdown,
    meta: {
      icon: 'markdown',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/editor/:id?`,
    name: 'MobileBookEditor',
    component: mobileBookEditor,
    meta: {
      icon: 'bookEditor',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/info/:id?`,
    name: 'MobileBookInfo',
    component: mobileBookInfo,
    meta: {
      icon: 'bookInfo',
      keepAlive: false
    }
  }, {
    path: `${prefix}/admin`,
    name: 'MobileAdmin',
    component: mobileAdmin,
    meta: {
      icon: 'manage',
      keepAlive: false
    }
  }]
}