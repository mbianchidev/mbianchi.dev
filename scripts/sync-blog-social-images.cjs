const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const sharp = require('sharp')
const socialImages = require('../src/data/socialImages.json')
const {
  generatedDirectory,
  generatedManifestPath,
  getBlogSocialImageOutput,
  isLocalBlogImageReference,
  isPublicBlogImageReference,
  isPublishedBlogPostFile,
  publicDirectory,
  resolveLocalBlogImage,
} = require('../src/lib/blogSocialImages')

const postsDirectory = path.join(process.cwd(), 'content', 'blog')
const imageTypes = {
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
}

async function syncBlogSocialImages() {
  fs.rmSync(publicDirectory, { recursive: true, force: true })
  fs.mkdirSync(publicDirectory, { recursive: true })
  fs.mkdirSync(generatedDirectory, { recursive: true })

  const manifest = {}
  const postFiles = fs
    .readdirSync(postsDirectory)
    .filter(isPublishedBlogPostFile)

  for (const fileName of postFiles) {
    const postFile = path.join(postsDirectory, fileName)
    const slug = fileName.replace(/\.md$/, '')
    const { data } = matter(fs.readFileSync(postFile, 'utf8'))
    const image = data.image

    if (typeof image !== 'string' || image.trim() === '') {
      throw new Error(`Blog post "${fileName}" requires a non-empty "image" field`)
    }

    if (Object.prototype.hasOwnProperty.call(socialImages, image)) {
      continue
    }

    if (!isLocalBlogImageReference(image)) {
      throw new Error(`Blog post "${fileName}" references an unknown social image: ${image}`)
    }

    const sourcePath = resolveLocalBlogImage(postFile, image)
    const output = isPublicBlogImageReference(image)
      ? { publicPath: image }
      : getBlogSocialImageOutput(slug, sourcePath)
    const metadata = await sharp(sourcePath).metadata()
    const type = metadata.format ? imageTypes[metadata.format] : undefined

    if (!metadata.width || !metadata.height || !type) {
      throw new Error(`Could not read blog social image metadata: ${image}`)
    }

    if ('destinationPath' in output) {
      fs.mkdirSync(path.dirname(output.destinationPath), { recursive: true })
      fs.copyFileSync(sourcePath, output.destinationPath)
    }

    manifest[slug] = {
      src: output.publicPath,
      width: metadata.width,
      height: metadata.height,
      type,
    }
  }

  fs.writeFileSync(generatedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Exported ${Object.keys(manifest).length} custom blog social image(s).`)
}

syncBlogSocialImages().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
