// 다른 언어 페이지가 실제로 있는지 확인 (없는 글로 보내 404가 나지 않게)
const cache = new Map<string, boolean>()

export async function exists(path: string): Promise<boolean> {
  if (path === '/' || path === '/en/') return true
  if (cache.has(path)) return cache.get(path)!
  const url = /\.html$/.test(path) || path.endsWith('/') ? path : `${path}.html`
  let ok = false
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    ok = res.ok
  } catch {}
  cache.set(path, ok)
  return ok
}
