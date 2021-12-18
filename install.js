const fs = require('fs')
const mongodb = './app/.mongo.config1.ts'
const isMongodbExist = fs.existsSync(mongodb)
if (isMongodbExist) {
  console.log('mongodb 配置文件已存在')
} else {
  console.log('正在创建mongodb 配置文件...')
  fs.writeFileSync(mongodb, `const mongoConfig = \`mongodb://用户名:${encodeURIComponent('密码')}@IP:端口/pkm\`
export default mongoConfig
  `)
  console.log(`${mongodb} 创建成功，请修改文件中对应数据库信息...`)
}

