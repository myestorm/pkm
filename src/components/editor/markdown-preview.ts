import MarkdownEditor from './markdown-editor'
import md2html, { markdownIt } from './parser/md2html'
import css from './markdown-preview.css'

class MarkdownPreview {
  editor!: MarkdownEditor
  elem!: Element
  iframe!: HTMLIFrameElement
  doc!: Document | undefined
  markdownIt = markdownIt
  scroll = () => {}

  activeCLass = 'active'

  constructor (elem: Element) {
    const iframe = document.createElement('iframe')
    iframe.src = 'about:blank'
    iframe.onload = () => {
      this.iframe = iframe
      this.doc = iframe.contentWindow?.document
    }
    this.elem = elem
    elem.appendChild(iframe)
  }

  setEditor (editor: MarkdownEditor) {
    this.editor = editor
  }

  /**
   * 更新预览页面
   * @param md string
   */
  update (md: string) {
    const doc = this.doc
    const body = this.parser(md)
    const page = this.pageContent(body)
    if (doc) {
      doc.open()
      doc.write(page)
      doc.close()
      doc.onscroll = () => {
        this.editor.previewToEditor()
      }
    }
  }

  /**
   * 预览页面模板
   * @param body string
   * @returns 
   */
  pageContent (body: string) {
    const content = `
      <html>
        <head>
        <style>${css}</style>
        </head>
        <body class="markdown-body">${body}</body>
      </html>
    `
    return content
  }

  /**
   * markdown文档转换成html
   * @param md string
   * @returns string
   */
  parser (md: string): string {
    let html = md2html(md)
    // 替换code的sourcemap
    html = html.replace(/<pre><code data-source-start="(\d+)" data-source-end="(\d+)" data-source-level="(\d+)"/g, '<pre data-source-start="$1" data-source-end="$2" data-source-level="$3"><code')
    return html
  }

  /**
   * 获取所属有的一级节点
   * @returns array
   */
  getTopLevelNodes (): Element[] {
    const nodes = this.doc?.querySelectorAll('[data-source-level="0"]')
    return nodes ? Array.from(nodes) : []
  }

  /**
   * 通过编辑器的行数，查找对应的html块
   * @param line number
   * @returns Element
   */
  getDombyLine (line?: number): Element | null {
    let res: Element | null = null
    if (typeof line === 'undefined') {
      return res
    }
    const nodes = this.getTopLevelNodes()
    for (const item of nodes) {
      const start = Number(item.getAttribute('data-source-start'))
      const end = Number(item.getAttribute('data-source-end'))
      if (line >= start && line <= end) {
        res = item
        break
      }
    }
    return res
  }

  /**
   * 设置与编辑对应的html块高亮
   * @param line number
   */
  setActive (line: number) {
    const curr = this.getDombyLine(line)
    this.removeActive()
    if (curr) {
      curr.classList.add(this.activeCLass)
    }
  }

  /**
   * 移除所有的高亮
   */
  removeActive () {
    const nodes = this.getTopLevelNodes()
    for (const item of nodes) {
      item.classList.remove(this.activeCLass)
    }
  }

}

export default MarkdownPreview
