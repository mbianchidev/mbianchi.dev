const fs = require('node:fs')
const path = require('node:path')

const generatedDirectory = path.join(process.cwd(), '.generated')
const generatedManifestPath = path.join(generatedDirectory, 'blog-social-images.json')
const publicDirectory = path.join(process.cwd(), 'public', 'blog-social-images')
const publicRootDirectory = path.join(process.cwd(), 'public')
const supportedExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])

function isPublishedBlogPostFile(fileName) {
  return (
    fileName.toLowerCase().endsWith('.md')
    && fileName.toUpperCase() !== 'README.MD'
    && !fileName.startsWith('_')
  )
}

function isLocalBlogImageReference(value) {
  return (
    typeof value === 'string'
    && (value.startsWith('/') || value.startsWith('./') || value.startsWith('../'))
  )
}

function isPublicBlogImageReference(value) {
  return typeof value === 'string' && value.startsWith('/')
}

function resolveLocalBlogImage(postFile, imageReference) {
  if (!isLocalBlogImageReference(imageReference)) {
    throw new Error(`Blog social images must use a catalog key or local path: ${imageReference}`)
  }

  const sourcePath = isPublicBlogImageReference(imageReference)
    ? path.resolve(publicRootDirectory, `.${imageReference}`)
    : path.resolve(path.dirname(postFile), imageReference)
  const allowedRoot = fs.realpathSync(
    isPublicBlogImageReference(imageReference) ? publicRootDirectory : process.cwd()
  )

  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new Error(`Blog social image does not exist: ${imageReference}`)
  }

  const realSourcePath = fs.realpathSync(sourcePath)
  const relativeSourcePath = path.relative(allowedRoot, realSourcePath)

  if (relativeSourcePath.startsWith('..') || path.isAbsolute(relativeSourcePath)) {
    const location = isPublicBlogImageReference(imageReference)
      ? 'the public directory'
      : 'the repository'
    throw new Error(`Blog social image must stay inside ${location}: ${imageReference}`)
  }

  const extension = path.extname(realSourcePath).toLowerCase()

  if (!supportedExtensions.has(extension)) {
    throw new Error(
      `Unsupported blog social image format "${extension}" for ${imageReference}`
    )
  }

  return realSourcePath
}

function getBlogSocialImageOutput(slug, sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase()
  const baseName = path
    .basename(sourcePath, extension)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-|-$/g, '')
  const fileName = `${baseName || 'preview'}${extension}`

  return {
    destinationPath: path.join(publicDirectory, slug, fileName),
    publicPath: `/blog-social-images/${slug}/${fileName}`,
  }
}

function getGeneratedBlogSocialImage(slug) {
  if (!fs.existsSync(generatedManifestPath)) {
    throw new Error(
      'Blog social image manifest is missing. Run "npm run blog:images" before building.'
    )
  }

  const manifest = JSON.parse(fs.readFileSync(generatedManifestPath, 'utf8'))
  const image = manifest[slug]

  if (!image) {
    throw new Error(`Generated blog social image is missing for "${slug}"`)
  }

  return image
}

module.exports = {
  generatedDirectory,
  generatedManifestPath,
  getBlogSocialImageOutput,
  getGeneratedBlogSocialImage,
  isLocalBlogImageReference,
  isPublicBlogImageReference,
  isPublishedBlogPostFile,
  publicDirectory,
  resolveLocalBlogImage,
}
