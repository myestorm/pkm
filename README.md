# pkm

Personal knowledge management

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
