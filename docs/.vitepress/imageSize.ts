// 글 속 그림에 원래 가로·세로 크기를 넣어 준다 (빌드할 때)
// - 그림이 늦게 떠도 자리가 미리 잡혀 있어서 아래 글이 밀리지 않는다 (CLS 방지)
// - 화면 밖 그림은 보일 때 받아 온다 (loading="lazy")
// - 외부 라이브러리 없이 PNG, JPEG, GIF, WebP 파일 머리 부분만 읽는다
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url))
const cache = new Map<string, { width: number; height: number } | null>()

function readSize(file: string): { width: number; height: number } | null {
  const b = fs.readFileSync(file)
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
  // GIF
  if (b.length > 10 && b.toString('ascii', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) }
  // WebP
  if (b.length > 30 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16)
    if (kind === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) }
    if (kind === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
  }
  // JPEG: SOF 마커를 찾는다
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      const len = b.readUInt16BE(i + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) }
      }
      i += 2 + len
    }
  }
  return null
}

export function imageSize(src: string) {
  if (!src.startsWith('/') || src.startsWith('//')) return null
  if (cache.has(src)) return cache.get(src)!
  let size: { width: number; height: number } | null = null
  try {
    const file = path.join(PUBLIC, decodeURIComponent(src.split(/[?#]/)[0]))
    if (fs.existsSync(file)) size = readSize(file)
  } catch {}
  cache.set(src, size)
  return size
}

// markdown-it 플러그인: ![설명](/images/a.png) → <img ... width height loading decoding>
export function imageSizePlugin(md: any) {
  md.core.ruler.after('inline', 'image-size', (state: any) => {
    for (const block of state.tokens) {
      for (const t of block.children || []) {
        if (t.type !== 'image') continue
        const size = imageSize(t.attrGet('src') || '')
        if (size && size.width && size.height) {
          t.attrSet('width', String(size.width))
          t.attrSet('height', String(size.height))
        }
        t.attrSet('loading', 'lazy')
        t.attrSet('decoding', 'async')
      }
    }
  })
}
