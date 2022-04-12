import Pclayout from '../../components/layout/pc-layout.vue'

import home from '../../views/pc/home.vue'

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
    component: home,
    meta: {
      title: '文档',
      icon: 'icon-file',
      nav: true,
      keepAlive: false
    }
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