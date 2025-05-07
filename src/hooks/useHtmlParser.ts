import { useState, useEffect } from 'react'

interface ParsedHtml {
  title: string
  body: string
  links: string[]
  images: string[]
}

export const useHtmlParser = (html: string) => {
  const [parsedContent, setParsedContent] = useState<ParsedHtml>({
    title: '',
    body: '',
    links: [],
    images: []
  })

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // タイトルの取得
    const title = doc.querySelector('title')?.textContent || ''

    // 本文の取得
    const body = doc.querySelector('body')?.innerHTML || ''

    // リンクの取得
    const links = Array.from(doc.querySelectorAll('a[href]'))
      .map(link => link.getAttribute('href'))
      .filter((href): href is string => href !== null)

    // 画像の取得
    const images = Array.from(doc.querySelectorAll('img[src]'))
      .map(img => img.getAttribute('src'))
      .filter((src): src is string => src !== null)

    setParsedContent({
      title,
      body,
      links,
      images
    })
  }, [html])

  return parsedContent
} 