import Pclayout from '../../components/layout/pc-layout.vue'

import home from '../../views/pc/home.vue'
import file from '../../views/pc/file.vue'
import fileEditor from '../../views/pc/file-editor.vue'
import book from '../../views/pc/book.vue'
import bookView from '../../views/pc/book-view.vue'
import setting from '../../views/pc/setting.vue'
import userinfo from '../../views/pc/userinfo.vue'

const prefix = '/p'

export default {
  path: prefix,
  name: 'PIndex',
  redirect: `${prefix}/home`,
  component: Pclayout,
  meta: {
    title: '首页',
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: `${prefix}/home`,
    name: 'PcHome',
    component: home,
    meta: {
      title: '首页',
      icon: 'home',
      keepAlive: false
    }
  }, {
    path: `${prefix}/file`,
    name: 'PcFile',
    component: file,
    meta: {
      title: '文档',
      icon: 'icon-file',
      nav: true,
      keepAlive: false
    },
    children: [{
      path: `${prefix}/file/editor/:id`,
      name: 'PcEditorView',
      component: fileEditor,
      meta: {
        title: '编辑文档',
        icon: 'icon-file',
        nav: true,
        keepAlive: false
      }
    }]
  }, {
    path: `${prefix}/book`,
    name: 'PcBook',
    component: book,
    meta: {
      title: '书架',
      icon: 'icon-bookmark',
      nav: true,
      keepAlive: false
    },
    children: [{
      path: `${prefix}/book/view/:id`,
      name: 'PcBookView',
      component: bookView,
      meta: {
        title: '查看书籍',
        icon: 'icon-file',
        nav: true,
        keepAlive: false
      }
    }]
  }, {
    path: `${prefix}/userinfo`,
    name: 'PcUserinfo',
    component: userinfo,
    meta: {
      title: '我的信息',
      icon: 'icon-info-circle',
      nav: false,
      keepAlive: false
    }
  }, {
    path: `${prefix}/setting`,
    name: 'PcSetting',
    component: setting,
    meta: {
      title: '设置',
      icon: 'icon-setting',
      nav: false,
      keepAlive: false
    }
  }]
}