import { EditorView, highlightSpecialChars, drawSelection, highlightActiveLine, keymap, ViewUpdate } from '@codemirror/view'
import { EditorState, EditorSelection, Extension, Transaction, Compartment } from '@codemirror/state'
import { history, historyKeymap } from '@codemirror/history'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { indentOnInput } from '@codemirror/language'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { defaultKeymap } from '@codemirror/commands'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { commentKeymap } from '@codemirror/comment'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { lintKeymap } from '@codemirror/lint'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'

import { oneDark } from './markdown-theme'
import MarkdownPreview from './markdown-preview'

export interface IEditorOptionsType {
  initValue: string;
  preview: MarkdownPreview
}

class MarkdownEditor {
  state: EditorState | null = null
  view: EditorView | null = null
  preview: MarkdownPreview | null = null
  elem: Element | null = null
  extensions: Extension[] = []

  mounted (element: Element, options?: IEditorOptionsType) {
    const updateListener = this.updateListener
    const lineWrappingComp = new Compartment()
    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter({
        markerDOM (open) {
          const className = open ? 'editor-unfold' : 'editor-fold'
          const span = document.createElement('span')
          span.classList.add(className)
          return span
        }
      }),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      defaultHighlightStyle.fallback,
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
        ...lintKeymap
      ]),
      markdown({
        base: markdownLanguage
      }),
      oneDark,
      updateListener,
      lineWrappingComp.of(EditorView.lineWrapping) // 自动换行
    ]

    this.extensions = extensions

    this.state = EditorState.create({
      doc: options?.initValue || '',
      extensions: this.extensions
    })
    if (element) {
      this.elem = element
      this.view = new EditorView({
        state: this.state,
        parent: element
      })
      if (options?.preview) {
        this.preview = options.preview
      }
    }
  }

  regExpcharacterEscape (str: string) {
    str = str.replace(/\{/gmi, '\\{')
    str = str.replace(/\}/gmi, '\\}')
    str = str.replace(/\(/gmi, '\\(')
    str = str.replace(/\)/gmi, '\\)')
    str = str.replace(/\//gmi, '\\/')
    str = str.replace(/\$/gmi, '\\$')
    str = str.replace(/\#/gmi, '\\#')
    str = str.replace(/\&/gmi, '\\&')
    str = str.replace(/\*/gmi, '\\*')
    str = str.replace(/\./gmi, '\\.')
    return str
  }

  /**
   * 编辑器事件
   */
  updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      // console.log(update.state.doc.toString())
    }
    if (update.selectionSet) {
      // const range = update.state.selection.ranges[0]
      // const line = update.state.doc.lineAt(range.from)
      // const a = this.preview?.doc?.querySelector('[data-source-start="3"][data-source-level="0"]')
      // a?.classList.add('active')
      // console.log(line.number)
      // console.log(update.view.hasFocus)
      this.selectionSet(update)
    }
  })

  selectionSet (update: ViewUpdate) {
    const preview = this.preview
    const range = update.state.selection.ranges[0]
    const line = update.state.doc.lineAt(range.from)
    console.log(update)
    if (preview) {
      const item = preview.findActiveDom(line.number)
      console.log(item)
      if (item && update.view.hasFocus) {
        item.classList.add('active')
      }
    }
  }

  /**
   * 在行首插入字符
   * @param insertion string
   */
  insertLineStart (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          // 获取光标所在的行的信息
          const line = state.doc.lineAt(range.from)
          // 获取行的内容
          const text = state.sliceDoc(line.from, line.to)
          return {
            changes: {
              from: line.from,
              to: line.to,
              insert: `${insertion}${text}` // 替换字符
            },
            range: EditorSelection.range(line.from, line.to + insertion.length) // 重置选区
          }
        })
      )
      view.dispatch(tr) // 更新界面数据
      view.focus() // 编辑器获得焦点
    }
  }

  /**
   * 删除行首的字符
   * @param insertion string
   */
  removeLineStart (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const line = state.doc.lineAt(range.from)
          let text = state.sliceDoc(line.from, line.to)
          text = text.replace(new RegExp(`^${this.regExpcharacterEscape(insertion)}`), '') 
          return {
            changes: {
              from: line.from,
              to: line.to,
              insert: text
            },
            range: EditorSelection.range(line.from, line.to - insertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * 两种状态切换，有则删除，没有则添加
   * @param insertion string
   */
  toggleInsertLineStart (insertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      state.selection.ranges.map(range => {
        const line = state.doc.lineAt(range.from)
        const selectionText = state.sliceDoc(line.from, line.to)
        const hasInsertion = new RegExp(`^${this.regExpcharacterEscape(insertion)}`).test(selectionText)
        if (hasInsertion) {
          this.removeLineStart(insertion)
        } else {
          this.insertLineStart(insertion)
        }
      })
    }
  }

  /**
   * 选区两端插入标签
   * @param startInsertion string
   * @param endInsertion string
   */
  insertAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const text = state.sliceDoc(range.from, range.to)
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: `${startInsertion}${text}${endInsertion}`
            },
            range: EditorSelection.range(range.from, range.to + startInsertion.length + endInsertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * 选区两端删除标签
   * @param startInsertion string
   * @param endInsertion string
   */
  removeAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          let text = state.sliceDoc(range.from, range.to)
          text = text.replace(new RegExp(`^${this.regExpcharacterEscape(startInsertion)}`), '')
          text = text.replace(new RegExp(`${this.regExpcharacterEscape(endInsertion)}$`), '')
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: text
            },
            range: EditorSelection.range(range.from, range.to - startInsertion.length - endInsertion.length)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }

  /**
   * 两种状态切换，有则删除，没有则添加
   * @param startInsertion string
   * @param endInsertion string
   */
  toggleAroundSelection (startInsertion: string, endInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      state.selection.ranges.map(range => {
        const selectionText = state.sliceDoc(range.from, range.to)
        const hasStartInsertion = new RegExp(`^${this.regExpcharacterEscape(startInsertion)}`).test(selectionText)
        const hasEndInsertion = new RegExp(`${this.regExpcharacterEscape(endInsertion)}$`).test(selectionText)
      
        if (hasStartInsertion && hasEndInsertion) {
          this.removeAroundSelection(startInsertion, endInsertion)
        } else {
          this.insertAroundSelection(startInsertion, endInsertion)
        }
      })
    }
  }

  /**
   * 在首尾插入两行，典型应用代码块
   * @param beforeInsertion string
   * @param afterInsertion string
   */
   insertAroundLine (beforeInsertion: string, afterInsertion: string) {
    const { view } = this
    if (view) {
      const state = view.state
      const tr: Transaction = state.update(
        state.changeByRange(range => {
          const text = state.sliceDoc(range.from, range.to)
          const from = range.from + beforeInsertion.length + 2
          const to = from
          return {
            changes: {
              from: range.from,
              to: range.to,
              insert: `\n\n${beforeInsertion}${text ? '\n' : ''}${text}\n${afterInsertion}\n\n`
            },
            range: EditorSelection.range(from , to)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }
}

export default MarkdownEditor
