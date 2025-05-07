import React, { useEffect, useRef } from 'react'
import { HTMLParser } from '../engine/HTMLParser'
import { Renderer } from '../engine/Renderer'

interface BrowserEngineProps {
  html: string
}

export const BrowserEngine: React.FC<BrowserEngineProps> = ({ html }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // キャンバスのサイズを設定
    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight

    // レンダラーの初期化
    if (!rendererRef.current) {
      rendererRef.current = new Renderer(canvasRef.current)
    }

    // 基本的なスタイルの設定
    rendererRef.current.setStyle('body', {
      backgroundColor: 'white',
      fontFamily: 'sans-serif',
      fontSize: '16px',
      color: 'black'
    })

    rendererRef.current.setStyle('h1', {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px'
    })

    rendererRef.current.setStyle('p', {
      marginBottom: '8px',
      lineHeight: '1.5'
    })

    // HTMLの解析と描画
    const parser = new HTMLParser(html)
    const domTree = parser.parse()
    rendererRef.current.render(domTree)
  }, [html])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
} 