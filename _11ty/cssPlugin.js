import { bundleAsync, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import path from 'node:path'

export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('css')
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (_content, filePath) => {
      if (path.parse(filePath).name.startsWith('_')) {
        return
      }
      return async () => {
        const { code } = await bundleAsync({
          filename: filePath,
          targets: browserslistToTargets(browserslist()),
          minify: true
        })
        return code
      }
    }
  })
}
