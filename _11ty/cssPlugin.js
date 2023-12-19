import { bundleAsync, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import path from 'node:path'

export default function (eleventyConfig) {
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
