import empty from '../../components/layout/empty.vue'
import mobileHome from '../../views/mobile/home.vue'
import mobileFile from '../../views/mobile/file.vue'
import mobileBook from '../../views/mobile/book.vue'
import mobileSetting from '../../views/mobile/setting.vue'
import mobilemMrkdown from '../../views/mobile/markdown.vue'
import mobilemBookEditor from '../../views/mobile/book-editor.vue'
import mobilemBookInfo from '../../views/mobile/book-info.vue'

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
    path: `${prefix}/book/:path*`,
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
    name: 'MobilemMrkdown',
    component: mobilemMrkdown,
    meta: {
      icon: 'markdown',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/editor/:path*`,
    name: 'MobilemBookEditor',
    component: mobilemBookEditor,
    meta: {
      icon: 'bookEditor',
      keepAlive: false
    }
  }, {
    path: `${prefix}/book/info/:path*`,
    name: 'MobilemBookInfo',
    component: mobilemBookInfo,
    meta: {
      icon: 'bookInfo',
      keepAlive: false
    }
  }]
}