/**
 * 获取字符的长度
 * @param str string
 * @returns number
 */
export function getStrLen (str: string = ''): number { 
  let len = 0
  for (let i = 0; i < str.length; i++) { 
    let currLen = str.charCodeAt(i)
    if (currLen >= 0 && currLen <= 128) { 
      len += 1
    } else { 
      len += 2
    } 
  } 
  return len
}

/**
 * 截断字符串，超出部分使用...代替
 * @param str string
 * @param len number
 * @param ellipsis string
 * @returns string
 */
export function subStr(str: string = '', len: number = 8, ellipsis: string = '...'): string {
  if (getStrLen(str) <= len) {
    return str
  } else {
    let formatStr = ''
    let strLen = 0
    for (let i = 0; i < str.length; i++) {
      strLen += getStrLen(str[i])
      if (strLen <= len) {
        formatStr += str[i]
      } else {
        break
      }
    }
    return formatStr + ellipsis	
  }
}
