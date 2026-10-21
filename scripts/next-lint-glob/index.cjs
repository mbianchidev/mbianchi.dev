const { globSync: tinyGlobSync } = require('tinyglobby')

function globSync(patterns, options) {
  // Fast-glob does not recursively expand literal directory patterns.
  return tinyGlobSync(patterns, { ...options, expandDirectories: false })
}

module.exports = { globSync }
