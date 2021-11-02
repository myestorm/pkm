const fontFamily = 'Consolas, "Courier New", "Microsoft YaHei", monospace, sans-serif'
const fontSize = '14px'
const lineHeight = '1.3'
export default {
  '&': {
    color: '#ffffff',
    backgroundColor: '#17171a'
  },
  '.cm-activeLine': {
    backgroundColor: '#000000'
  },
  '.cm-activeLineGutter': {
    color: '#ffffff',
    backgroundColor: '#000000'
  },
  '.cm-gutterElement1': {
    color: '#999999'
  },
  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: "#0b4b73"
  },
  '.cm-content': {
    fontFamily,
    fontSize,
    lineHeight
  },
  '.cm-gutters': {
    backgroundColor: '#17171a',
    color: '#999999'
  },
  '.cm-gutter': {
    fontFamily,
    fontSize,
    lineHeight
  }
}