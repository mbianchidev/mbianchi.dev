// Integration marks show their brand colour on a hovered tile, whose background is --bg-elevated.
export const hoverBackground = '#252528'
export const minimumBrandContrast = 3

const neutralColor = '#FFFFFF'
const neutralChroma = 0.1
const lightnessStep = 0.02

type Rgb = [number, number, number]

const parseHex = (hex: string): Rgb => {
  const value = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Expected a six-digit hex colour, received "${hex}"`)
  }

  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255) as Rgb
}

const toHex = (rgb: Rgb) =>
  `#${rgb
    .map((channel) => Math.round(channel * 255).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`

const relativeLuminance = (rgb: Rgb) => {
  const [red, green, blue] = rgb.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function contrastRatio(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(parseHex(first)), relativeLuminance(parseHex(second))]
    .sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

const toHsl = ([red, green, blue]: Rgb): Rgb => {
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) {
    return [0, 0, lightness]
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  const hue =
    max === red
      ? ((green - blue) / delta + 6) % 6
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4

  return [hue * 60, saturation, lightness]
}

const fromHsl = ([hue, saturation, lightness]: Rgb): Rgb => {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const segment = hue / 60
  const secondary = chroma * (1 - Math.abs((segment % 2) - 1))
  const match = lightness - chroma / 2
  const [red, green, blue] =
    segment < 1 ? [chroma, secondary, 0]
      : segment < 2 ? [secondary, chroma, 0]
        : segment < 3 ? [0, chroma, secondary]
          : segment < 4 ? [0, secondary, chroma]
            : segment < 5 ? [secondary, 0, chroma]
              : [chroma, 0, secondary]

  return [red + match, green + match, blue + match]
}

// Keeps the brand hue and raises only its lightness until the mark is legible. Neutral black
// or grey brands have no hue to keep, so they use Signal White.
export function readableBrandColor(hex: string, background = hoverBackground) {
  const rgb = parseHex(hex)

  if (contrastRatio(hex, background) >= minimumBrandContrast) {
    return toHex(rgb)
  }

  if (Math.max(...rgb) - Math.min(...rgb) < neutralChroma) {
    return neutralColor
  }

  const [hue, saturation, lightness] = toHsl(rgb)
  for (let candidate = lightness; candidate <= 1; candidate += lightnessStep) {
    const color = toHex(fromHsl([hue, saturation, candidate]))
    if (contrastRatio(color, background) >= minimumBrandContrast) {
      return color
    }
  }

  return neutralColor
}
