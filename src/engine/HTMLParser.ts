export interface DOMNode {
  type: 'element' | 'text'
  tagName?: string
  attributes?: Map<string, string>
  children: DOMNode[]
  textContent?: string
}

export class HTMLParser {
  private pos: number = 0
  private input: string

  constructor(html: string) {
    this.input = html
  }

  parse(): DOMNode {
    return this.parseNode()
  }

  private parseNode(): DOMNode {
    // 空白をスキップ
    this.skipWhitespace()

    // テキストノードの処理
    if (this.pos < this.input.length && this.input[this.pos] !== '<') {
      return this.parseText()
    }

    // 要素ノードの処理
    if (this.input[this.pos] === '<') {
      return this.parseElement()
    }

    return { type: 'text', textContent: '', children: [] }
  }

  private parseText(): DOMNode {
    let text = ''
    while (this.pos < this.input.length && this.input[this.pos] !== '<') {
      text += this.input[this.pos]
      this.pos++
    }
    return { type: 'text', textContent: text, children: [] }
  }

  private parseElement(): DOMNode {
    // < をスキップ
    this.pos++

    // タグ名の取得
    const tagName = this.parseTagName()
    const attributes = this.parseAttributes()

    // 自己終了タグの処理
    if (this.input[this.pos - 1] === '/') {
      return { type: 'element', tagName, attributes, children: [] }
    }

    // 子要素の解析
    const children: DOMNode[] = []
    while (this.pos < this.input.length) {
      // 終了タグの確認
      if (this.input[this.pos] === '<' && this.input[this.pos + 1] === '/') {
        this.pos += 2
        const endTag = this.parseTagName()
        if (endTag === tagName) {
          this.pos++ // > をスキップ
          break
        }
      }

      const child = this.parseNode()
      children.push(child)
    }

    return { type: 'element', tagName, attributes, children }
  }

  private parseTagName(): string {
    let tagName = ''
    while (this.pos < this.input.length && /[a-zA-Z0-9]/.test(this.input[this.pos])) {
      tagName += this.input[this.pos]
      this.pos++
    }
    return tagName.toLowerCase()
  }

  private parseAttributes(): Map<string, string> {
    const attributes = new Map<string, string>()

    while (this.pos < this.input.length) {
      this.skipWhitespace()

      if (this.input[this.pos] === '>' || this.input[this.pos] === '/') {
        this.pos++
        break
      }

      const name = this.parseAttributeName()
      let value = ''

      if (this.input[this.pos] === '=') {
        this.pos++ // = をスキップ
        value = this.parseAttributeValue()
      }

      attributes.set(name, value)
    }

    return attributes
  }

  private parseAttributeName(): string {
    let name = ''
    while (this.pos < this.input.length && /[a-zA-Z0-9-]/.test(this.input[this.pos])) {
      name += this.input[this.pos]
      this.pos++
    }
    return name
  }

  private parseAttributeValue(): string {
    const quote = this.input[this.pos]
    if (quote !== '"' && quote !== "'") {
      return ''
    }

    this.pos++ // 開始の引用符をスキップ
    let value = ''

    while (this.pos < this.input.length && this.input[this.pos] !== quote) {
      value += this.input[this.pos]
      this.pos++
    }

    this.pos++ // 終了の引用符をスキップ
    return value
  }

  private skipWhitespace() {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++
    }
  }
} 