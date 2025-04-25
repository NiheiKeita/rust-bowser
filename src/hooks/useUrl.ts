export const useUrl = () => {
  const getUrl = (url: string) => {
    return new URL(url, import.meta.env.BASE_URL).href
  }

  return {
    getUrl
  }
}