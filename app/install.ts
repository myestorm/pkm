import mongoose from 'mongoose'
import { MD5 } from 'crypto-js'
import Admin from './controllers/admin'

import mongoConfig from './.mongo.config'

(async function() {
  mongoose.connect(mongoConfig)
  mongoose.connection.on('error', console.error)

  // 新建管理用户
  const admin = new Admin()
  const pwd = 'totonoo'
  const userinfo = {
    username: 'totonoo',
    password: MD5(pwd).toString(),
    avatar: '',
    nickname: 'totonoo',
    mobile: '18688886666',
    email: 'totonoo@totonoo.com',
    root: true,
    status: 1,
    createdBy: '', 
    updatedBy: ''
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
})()
