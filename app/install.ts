import mongoose from 'mongoose'
import { MD5 } from 'crypto-js'
import Admin from './controllers/admin'
import Knowledge from './controllers/knowledge'

import mongoConfig from './.mongo.config'

(async function() {
  mongoose.connect(mongoConfig)
  mongoose.connection.on('error', console.error)

  // 新建管理用户
  const admin = new Admin()
  const knowledge = new Knowledge()
  const pwd = 'totonoo'
  const userinfo = {
    username: 'totonoo',
    password: MD5(pwd).toString(),
    avatar: '',
    nickname: 'totonoo',
    mobile: '18688886666',
    email: 'totonoo@totonoo.com',
  }
  const result = await admin.checkUnique('username', userinfo.username)
  if (!result) {
    admin.add(userinfo).then(() => {
      console.log(`创建用户成功：${userinfo.username} / ${pwd}`)
    }).catch(err => {
      console.log(err)
    })
  } else {
    console.log('用户已经存在')
  }
  // 新建默认知识库
  await knowledge.add({
    title: '我的文档',
    isDefault: true,
    desc: '我的文档',
    thumb: '',
    children: []
  }).then(() => {
    console.log('成功创建默认知识库')
    process.exit()
  }).catch(err => {
    console.log(err)
  })
})()
