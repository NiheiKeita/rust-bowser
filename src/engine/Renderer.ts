import { DOMNode } from './HTMLParser'

interface StyleProperties {
  backgroundColor?: string
  border?: boolean
  borderColor?: string
  borderWidth?: number
  fontFamily?: string
  fontSize?: string
  color?: string
  [key: string]: unknown
}

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private styles: Map<string, StyleProperties> = new Map()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas context could not be created')
    }
    this.ctx = context
  }

  render(node: DOMNode) {
    // キャンバスをクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // デフォルトスタイルの設定
    this.ctx.font = '16px sans-serif'
    this.ctx.fillStyle = 'black'

    // ノードの描画開始
    this.renderNode(node, 0, 0)
  }

  private renderNode(node: DOMNode, x: number, y: number): { width: number; height: number } {
    if (node.type === 'text') {
      return this.renderText(node, x, y)
    } else {
      return this.renderElement(node, x, y)
    }
  }

  private renderText(node: DOMNode, x: number, y: number): { width: number; height: number } {
    if (!node.textContent) {
      return { width: 0, height: 0 }
    }

    const metrics = this.ctx.measureText(node.textContent)
    this.ctx.fillText(node.textContent, x, y + 16) // 16はフォントサイズ

    return {
      width: metrics.width,
      height: 20 // テキストの高さ（フォントサイズ + 余白）
    }
  }

  private renderElement(node: DOMNode, x: number, y: number): { width: number; height: number } {
    if (!node.tagName) {
      return { width: 0, height: 0 }
    }

    // 要素のスタイルを適用
    this.applyStyles(node)

    let currentY = y
    let maxWidth = 0

    // 子要素の描画
    for (const child of node.children) {
      const { width, height } = this.renderNode(child, x, currentY)
      currentY += height
      maxWidth = Math.max(maxWidth, width)
    }

    // 要素の背景とボーダーを描画
    this.renderElementBox(node, x, y, maxWidth, currentY - y)

    return {
      width: maxWidth,
      height: currentY - y
    }
  }

  private renderElementBox(node: DOMNode, x: number, y: number, width: number, height: number) {
    const style = this.styles.get(node.tagName || '') || {}

    // 背景色の描画
    if (style.backgroundColor) {
      this.ctx.fillStyle = style.backgroundColor
      this.ctx.fillRect(x, y, width, height)
    }

    // ボーダーの描画
    if (style.border) {
      this.ctx.strokeStyle = style.borderColor || 'black'
      this.ctx.lineWidth = style.borderWidth || 1
      this.ctx.strokeRect(x, y, width, height)
    }
  }

  private applyStyles(node: DOMNode) {
    if (!node.tagName) return

    const style = this.styles.get(node.tagName) || {}

    // フォントスタイルの適用
    if (style.fontFamily) {
      this.ctx.font = `${style.fontSize || '16px'} ${style.fontFamily}`
    }

    // テキストカラーの適用
    if (style.color) {
      this.ctx.fillStyle = style.color
    }

    // その他のスタイルプロパティの適用
    if (node.attributes) {
      const styleAttr = node.attributes.get('style')
      if (styleAttr) {
        this.parseInlineStyles(styleAttr)
      }
    }
  }

  private parseInlineStyles(styleString: string) {
    const styles = styleString.split(';')
    for (const style of styles) {
      const [property, value] = style.split(':').map(s => s.trim())
      if (property && value) {
        // CanvasRenderingContext2Dのプロパティに限定して適用
        const validProperties = [
          'fillStyle',
          'strokeStyle',
          'lineWidth',
          'font',
          'textAlign',
          'textBaseline'
        ] as const

        if (validProperties.includes(property as typeof validProperties[number])) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (this.ctx as any)[property] = value
        }
      }
    }
  }

  // スタイルの設定
  setStyle(selector: string, styles: StyleProperties) {
    this.styles.set(selector, styles)
  }
} 