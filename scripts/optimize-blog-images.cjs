const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const sharp = require('sharp')
const { parseDocument, isNode } = require('yaml')
const { parseFrontMatter } = require('../src/lib/frontMatter')
const socialImages = require('../src/data/socialImages.json')

const root = process.cwd()
const publicRoot = path.join(root, 'public')
const postsDirectory = path.join(root, 'content/blog')
const imageDirectory = path.join(publicRoot, 'images/blog')
const optimized = new Map()
let imported = 0
let animated = 0

sharp.concurrency(1)

function digest(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 20)
}

function assertInside(directory, file) {
  const relative = path.relative(fs.realpathSync(directory), fs.realpathSync(file))

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Blog image must stay inside ${directory}: ${file}`)
  }
}

async function animationTimeline(input, metadata) {
  const pixels = await sharp(input, { animated: true }).ensureAlpha().raw().toBuffer()
  const count = metadata.pages ?? 1
  const frameBytes = pixels.length / count
  const timeline = []

  for (let frame = 0; frame < count; frame += 1) {
    const image = pixels.subarray(frame * frameBytes, (frame + 1) * frameBytes)
    for (let offset = 0; offset < image.length; offset += 4) {
      // Transparent RGB values do not change the displayed image.
      if (image[offset + 3] === 0) image.fill(0, offset, offset + 3)
    }
    const hash = createHash('sha256').update(image).digest('hex')
    const duration = metadata.delay?.[frame]
    if (typeof duration !== 'number') {
      throw new Error('Animation timing is missing')
    }
    const previous = timeline.at(-1)
    if (previous?.hash === hash) previous.duration += duration
    else timeline.push({ hash, duration })
  }
  return timeline
}

async function optimizeImage(reference, postFile) {
  const remote = /^https?:\/\//i.test(reference)
  let publicPath
  let input
  let key

  if (remote) {
    const url = new URL(reference)
    if (url.protocol !== 'https:') {
      throw new Error(`Blog image downloads require HTTPS: ${reference}`)
    }

    key = url.toString()
    publicPath = `/images/blog/body/${digest(key)}.webp`
    if (optimized.has(key)) return optimized.get(key)

    const cached = path.join(publicRoot, publicPath)
    if (fs.existsSync(cached)) {
      assertInside(publicRoot, cached)
      const metadata = await sharp(cached, { animated: true }).metadata()
      if (metadata.format !== 'webp') {
        throw new Error(`Cached blog image is not WebP: ${cached}`)
      }
      optimized.set(key, publicPath)
      return publicPath
    }

    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) {
      throw new Error(`Could not download ${reference}: ${response.status} ${response.statusText}`)
    }
    if (!response.headers.get('content-type')?.startsWith('image/')) {
      throw new Error(`Expected an image response from ${reference}`)
    }
    input = Buffer.from(await response.arrayBuffer())
  } else {
    const normalized = reference.replace(/^\/public\//, '/')
    const file = normalized.startsWith('/')
      ? path.resolve(publicRoot, `.${normalized}`)
      : path.resolve(path.dirname(postFile), normalized)
    assertInside(normalized.startsWith('/') ? publicRoot : root, file)
    key = fs.realpathSync(file)
    if (optimized.has(key)) return optimized.get(key)
    input = fs.readFileSync(file)
    const relative = path.relative(imageDirectory, file)
    publicPath = !relative.startsWith('..') && !path.isAbsolute(relative)
      ? `/images/blog/${relative.split(path.sep).join('/').replace(/\.[^/.]+$/, '')}.webp`
      : `/images/blog/body/${digest(input)}.webp`
  }

  const before = await sharp(input, { animated: true }).metadata()
  const output = before.format === 'webp'
    ? input
    : await sharp(input, { animated: true })
      .rotate()
      .keepMetadata()
      .webp({
        quality: 85,
        lossless: before.format === 'png' || before.format === 'gif',
        effort: 6,
        ...(before.loop !== undefined ? { loop: before.loop } : {}),
        ...(before.delay ? { delay: before.delay } : {}),
      })
      .toBuffer()
  const after = await sharp(output, { animated: true }).metadata()
  const rotated = before.format !== 'webp' && before.orientation >= 5 && before.orientation <= 8
  const expectedWidth = rotated ? (before.pageHeight ?? before.height) : before.width
  const expectedHeight = rotated ? before.width : (before.pageHeight ?? before.height)

  if (
    after.format !== 'webp'
    || after.width !== expectedWidth
    || (after.pageHeight ?? after.height) !== expectedHeight
  ) {
    throw new Error(`Image dimensions or WebP conversion failed for ${reference}`)
  }

  if ((before.pages ?? 1) > 1) {
    if ((after.pages ?? 1) < 2 || before.loop !== after.loop) {
      throw new Error(`Animation or looping changed for ${reference}`)
    }
    if (output !== input) {
      // WebP may merge identical frames while preserving their combined duration.
      const originalTimeline = await animationTimeline(input, before)
      const convertedTimeline = await animationTimeline(output, after)
      if (JSON.stringify(originalTimeline) !== JSON.stringify(convertedTimeline)) {
        throw new Error(`Animation pixels or timing changed for ${reference}`)
      }
    }
  } else if ((after.pages ?? 1) !== 1) {
    throw new Error(`Unexpected animation generated for ${reference}`)
  }

  const destination = path.join(publicRoot, publicPath)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  assertInside(publicRoot, path.dirname(destination))
  if (fs.existsSync(destination)) {
    if (!fs.readFileSync(destination).equals(output)) {
      throw new Error(`Refusing to overwrite a different image: ${destination}`)
    }
  } else {
    fs.writeFileSync(destination, output, { flag: 'wx' })
    imported += 1
    if ((after.pages ?? 1) > 1) animated += 1
    console.log(`Imported ${publicPath}: ${before.format}, ${after.pages ?? 1} frame(s), ${input.length} -> ${output.length} bytes`)
  }
  optimized.set(key, publicPath)
  return publicPath
}

function imageNodes(tree) {
  const images = []
  const references = new Set()
  const definitions = new Map()

  function visit(node) {
    if (node.type === 'image') images.push(node)
    if (node.type === 'imageReference') references.add(node.identifier)
    if (node.type === 'definition') definitions.set(node.identifier, node)
    for (const child of node.children ?? []) visit(child)
  }

  visit(tree)
  for (const identifier of references) {
    const definition = definitions.get(identifier)
    if (!definition) throw new Error(`Missing image definition: ${identifier}`)
    images.push(definition)
  }
  return images
}

function imageUrlEdit(node, content, offset, replacement) {
  const raw = content.slice(node.position.start.offset, node.position.end.offset)
  const prefix = node.type === 'image' ? /\]\(\s*<?$/ : /^\[[\s\S]*\]:\s*<?$/
  let position = raw.indexOf(node.url)

  while (position !== -1 && !prefix.test(raw.slice(0, position))) {
    position = raw.indexOf(node.url, position + node.url.length)
  }
  if (position === -1) {
    throw new Error(`Could not locate the Markdown image URL: ${node.url}`)
  }

  const start = offset + node.position.start.offset + position
  return { start, end: start + node.url.length, replacement }
}

async function optimizeBlogImages() {
  assertInside(root, postsDirectory)
  assertInside(root, publicRoot)
  assertInside(publicRoot, imageDirectory)
  const [{ remark }, { default: gfm }] = await Promise.all([
    import('remark'),
    import('remark-gfm'),
  ])
  const processor = remark().use(gfm)
  const files = fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md') && !['README.md', '_template.md'].includes(file))
  let updated = 0

  for (const file of files) {
    const postFile = path.join(postsDirectory, file)
    const source = fs.readFileSync(postFile, 'utf8')
    const { data, content } = parseFrontMatter(source, postFile)
    if (!source.endsWith(content)) {
      throw new Error(`Could not preserve the Markdown source in ${file}`)
    }

    const edits = []
    for (const node of imageNodes(processor.parse(content))) {
      const replacement = await optimizeImage(node.url, postFile)
      if (replacement !== node.url) {
        edits.push(imageUrlEdit(node, content, source.length - content.length, replacement))
      }
    }

    if (typeof data.image === 'string') {
      const reference = Object.hasOwn(socialImages, data.image)
        ? socialImages[data.image].src
        : data.image
      if (/^(?:https?:\/\/|\/|\.\/|\.\.\/)/.test(reference)) {
        const replacement = await optimizeImage(reference, postFile)
        if (replacement !== data.image) {
          const frontMatter = /^(\uFEFF?---\r?\n)([\s\S]*?)(\r?\n---)(?=\r?\n|$)/.exec(source)
          const document = frontMatter ? parseDocument(frontMatter[2]) : null
          const image = document?.get('image', true)
          if (!frontMatter || document.errors.length || !isNode(image) || !image.range) {
            throw new Error(`Could not locate the cover image field in ${file}`)
          }
          edits.push({
            start: frontMatter[1].length + image.range[0],
            end: frontMatter[1].length + image.range[1],
            replacement: JSON.stringify(replacement),
          })
        }
      } else if (!file.startsWith('_')) {
        throw new Error(`Unknown cover image in ${file}: ${data.image}`)
      }
    }

    if (edits.length > 0) {
      if (fs.readFileSync(postFile, 'utf8') !== source) {
        throw new Error(`The post changed during image conversion; refusing to overwrite ${file}`)
      }
      let result = source
      for (const edit of edits.sort((left, right) => right.start - left.start)) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end)
      }
      fs.writeFileSync(postFile, result)
      updated += 1
    }
  }

  console.log(`Updated ${updated} blog file(s); imported ${imported} WebP image(s), including ${animated} animation(s). Originals were not deleted.`)
}

optimizeBlogImages().catch((error) => {
  console.error('Failed to optimize blog images.', error)
  process.exitCode = 1
})
