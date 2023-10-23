const { bundleAsync, browserslistToTargets } = require('lightningcss')
const browserslist = require('browserslist')
const path = require('node:path')

module.exports = function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('css')
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (_content, filePath) => {
      return async () => {
        const { code } = await bundleAsync({
          filename: filePath,
          targets: browserslistToTargets(browserslist()),
          minify: true,
          resolver: {
            resolve (specifier, _importer) {
              return path.resolve('./src/_includes/css', specifier)
            }
          }
        })
        return code
      }
    }
  })
}
