import glob from 'glob'
import path from 'path'

export default (maxDeep = 5): string => {
  const filename = 'package.json'
  const arr = []
  let rootDir = ''

  for (let start = 0; start < maxDeep; start ++) {
    const res = glob.sync(path.join(__dirname, arr.join('') + filename))
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
