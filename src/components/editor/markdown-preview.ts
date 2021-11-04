import md2html, { markdownIt } from './parser/md2html'
import css from './markdown-preview.css'

class MarkdownPreview {
  iframe: Element | null = null
  doc: Document | null = null
  markdownIt = markdownIt

  init (iframe: HTMLIFrameElement | null) {
    if (iframe) {
      this.iframe = iframe
      this.doc = iframe.contentWindow?.document || null
    }
  }

  update (md: string) {
    const doc = this.doc
    const html = this.parser(md)
    const page = this.docContent(html)
    if (doc) {
      doc.open()
      doc.write(page)
      doc.close()
    }
  }

  docContent (body: string) {
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

  parser (md: string): string {
    return md2html(md)
  }

  findActiveDom (line: number) {
    const nodes = this.doc?.querySelectorAll('[data-source-level="0"]')
    let res: Element | null = null
    if (nodes && nodes.length > 0) {
      const items = Array.from(nodes) 
      for (const item of items) {
        const start = Number(item.getAttribute('data-source-start'))
        const end = Number(item.getAttribute('data-source-end'))
        if (line >= start && line <= end) {
          res = item
          break
        }
      }
    }
    return res
  }

}

export default MarkdownPreview
