import Pclayout from '../../components/layout/pc-layout.vue'

import home from '../../views/pc/home.vue'
import file from '../../views/pc/file.vue'
import fileEditor from '../../views/pc/file-editor.vue'

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
    component: home,
    meta: {
      title: '书架',
      icon: 'icon-bookmark',
      nav: true,
      keepAlive: false
    }
  }]
}