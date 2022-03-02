import layout from '../../components/layout/layout.vue'

import home from '../../views/home.vue'

const prefix = '/p'

export default {
  path: prefix,
  name: 'PIndex',
  redirect: `${prefix}/home`,
  component: layout,
  meta: {
    icon: 'home',
    keepAlive: false
  },
  children: [{
    path: `${prefix}/home`,
    name: 'PcHome',
    component: home,
    meta: {
      icon: 'home',
      keepAlive: false
    },
    children: []
  }]
}