const matter = require('gray-matter')
const { load } = require('js-yaml')

function parseFrontMatter(source, filename) {
  const { data, content } = matter(source, {
    engines: {
      yaml: {
        parse: (metadata) => load(metadata, { filename }),
      },
    },
  })
  const prototype = data !== null && typeof data === 'object'
    ? Object.getPrototypeOf(data)
    : undefined

  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(`Front matter in "${filename}" must be a YAML mapping`)
  }

  return { data, content }
}

module.exports = { parseFrontMatter }
