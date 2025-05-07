import React from 'react'
import { useHtmlParser } from '../hooks/useHtmlParser'

interface BrowserViewProps {
  html: string
}

export const BrowserView: React.FC<BrowserViewProps> = ({ html }) => {
  const { title, body, links, images } = useHtmlParser(html)

  return (
    <div className="browser-view">
      <div className="browser-header">
        <h1>{title}</h1>
      </div>
      <div
        className="browser-content"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <div className="browser-resources">
        <div className="links">
          <h3>リンク一覧</h3>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="images">
          <h3>画像一覧</h3>
          <div className="image-grid">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`画像 ${index + 1}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 