# pkm

Personal knowledge management

## 安装

### 配置数据库信息

在app目录下新建文件 `.mongo.config.ts`，输入一下内容：

```javascript
const mongoConfig = `mongodb://用户名:${encodeURIComponent('密码')}@地址:端口/库名`
export default mongoConfig
```

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
