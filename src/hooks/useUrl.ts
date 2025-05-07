export const useUrl = () => {
  const getUrl = (url: string) => {
    return new URL(url, import.meta.env.BASE_URL).href
  }

  const parseUrl = (url: string) => {
    const parsedUrl = new URL(url, import.meta.env.BASE_URL)
    return {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
      hash: parsedUrl.hash
    }
  }

  const fetchHtml = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const html = await response.text()
      return html
    } catch (error) {
      console.error('HTMLの取得に失敗しました:', error)
      throw error
    }
  }

  return {
    getUrl,
    parseUrl,
    fetchHtml
  }
}