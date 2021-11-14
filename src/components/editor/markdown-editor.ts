import { EditorView, highlightSpecialChars, drawSelection, highlightActiveLine, keymap, ViewUpdate, KeyBinding } from '@codemirror/view'
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

interface IEditorEventsType {
  focus: Function;
  change: Function;
  blur: Function;
  save: Function;
}

export interface IEditorOptionsType {
  id: string;
  initValue: string;
  events: IEditorEventsType;
}

class MarkdownEditor {
  state!: EditorState
  view!: EditorView
  preview!: MarkdownPreview
  elem!: Element
  extensions!: Extension[]
  events!: IEditorEventsType

  isEditorScroll = false
  isPreviewScroll = false

  constructor (options: IEditorOptionsType) {
    const elem = this.$$(`#${options.id}-editor`)
    const previewEle = this.$$(`#${options.id}-preview`)
    if (!elem || !previewEle) {
      return
    }
    this.elem = elem
    this.events = options.events
    const preview = new MarkdownPreview(previewEle)
    const updateListener = this.updateListener // 编辑器更新
    const lineWrappingComp = new Compartment() // 较长文本是否换行
    const scrollEvent = (event: Event) => { // 编辑器滚动事件
      this.editorToPreview()
    }
    // 自定义快捷键
    const saveKeyMap: KeyBinding[] = [
      {
        key: 'Ctrl-s',
        mac: 'Cmd-s',
        preventDefault: true,
        run: (view: EditorView) => {
          options.events.save(view)
          return false
        }
      }
    ]
    const extensions = [ // 编辑器扩展
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
        ...lintKeymap,
        ...saveKeyMap
      ]),
      markdown({
        base: markdownLanguage
      }),
      oneDark,
      updateListener,
      lineWrappingComp.of(EditorView.lineWrapping), // 自动换行
      EditorView.domEventHandlers({ // 绑定事件
        scroll: scrollEvent
      })
    ]
    this.extensions = extensions
    this.state = EditorState.create({
      doc: options.initValue,
      extensions: this.extensions
    })
    this.view = new EditorView({
      state: this.state,
      parent: this.elem
    })
    this.preview = preview // 预览
    this.preview.setEditor(this)
    this.preview.update(options.initValue)
  }

  $$ (exp: string): Element | null {
    return document.querySelector(exp)
  }

  getValue (): string {
    const value = this.view.state.doc.toString()
    return value
  }

  setValue (val: string = '') {
    const state = EditorState.create({
      doc: val,
      extensions: this.extensions
    })
    this.view.setState(state)
    this.state = state
    this.preview.update(val)
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
      const value = update.state.doc.toString()
      this.preview.update(value)
      this.events.change(update)
    }
    if (update.selectionSet) { // 选区变化
      this.selectionSet(update)
    }

    if (update.focusChanged) { // 焦点变化
      this.focusChanged(update)
    }
  })

  selectionSet (update: ViewUpdate) {
    const preview = this.preview
    const range = update.state.selection.ranges[0]
    const line = update.state.doc.lineAt(range.from)
    preview?.setActive(line.number)
  }

  focusChanged (update: ViewUpdate) {
    const preview = this.preview
    if(!update.view.hasFocus) {
      preview?.removeActive()
      this.events.blur(update)
    } else {
      this.events.focus(update)
    }
  }

  // editor -> preview
  editorToPreview () {
    if (this.isPreviewScroll) {
      this.isPreviewScroll = false
      return false
    }
    this.isEditorScroll = true
    const editor = this.view.scrollDOM
    const doc = this.preview.doc
    if (editor && doc) {
      const preview = doc.body
      const height = editor.scrollHeight - editor.clientHeight
      const ratio = parseFloat(editor.scrollTop.toString()) / height
      const move = (preview.scrollHeight - preview.clientHeight) * ratio
      preview.scrollTop = move
    }
  }
  // preview -> editor
  previewToEditor () {
    if (this.isEditorScroll) {
      this.isEditorScroll = false
      return false
    }
    const editor = this.view.scrollDOM
    const doc = this.preview.doc
    if (editor && doc) {
      this.isPreviewScroll = true
      const preview = doc.body
      const height = preview.scrollHeight - preview.clientHeight
      const ratio = parseFloat(preview.scrollTop.toString()) / height
      const move = (editor.scrollHeight - editor.clientHeight) * ratio
      editor.scrollTop = move
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

  /**
   * 在光标后插入一行
   * @param insertion string
   */
   insertLineAfterCursor (insertion: string) {
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
              insert: `${text}\n\n${insertion}\n\n`
            },
            range: EditorSelection.range(range.from , range.to)
          }
        })
      )
      view.dispatch(tr)
      view.focus()
    }
  }
}

export default MarkdownEditor
