import glob from 'glob'
import path from 'path'

export default (maxDeep = 5): string => {
  const filename = 'package.json'
  const arr = []
  let rootDir = ''
  for (let start = 0; start < maxDeep; start ++) {
    let filepath = path.join(__dirname, arr.join('') + filename)
    filepath = filepath.replace(/\\/gmi, '/')
    const res = glob.sync(filepath)
    if (res.length === 0) {
      arr.push('../')
    } else {
      rootDir = res[0]
      break
    }
  }
  rootDir = path.resolve(__dirname, rootDir)
  rootDir = path.parse(rootDir).dir
  return rootDir
}
