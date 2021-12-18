# pkm

Personal knowledge management

## 开发安装

### 1. 安装依赖

```sh
npm install
```

### 2. 配置数据库信息

在app目录下新建文件 `.mongo.config.ts`，输入一下内容：

```javascript
const mongoConfig = `mongodb://用户名:${encodeURIComponent('密码')}@地址:端口/库名`
export default mongoConfig
```

### 3. 添加初始用户

修改 `app/install.ts` 中对应的信息

```sh
npm run app-install
```

### 4. 查看效果

```sh
npm run dev
```

<http://localhost:3000> -> FE  
<http://localhost:4000> -> KOA server

## 发布到生产

建议使用PM2，全局安装pm2 `npm install pm2 -g`

```sh
npm run build
npm start
# npm run start-docker
```

入口文件为 `./www/app.js`

## 常用方法

### 使用axios

```typescript
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue'
const { appContext } = getCurrentInstance() as ComponentInternalInstance
const { $axios } = appContext.config.globalProperties

$axios.get('/api/documents').then((res: any) => {
  console.log(res)
})
```
