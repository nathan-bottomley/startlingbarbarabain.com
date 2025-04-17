import { bundleAsync, browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import path from 'node:path'

export default function (eleventyConfig) {
  eleventyConfig.addTemplateFormats('css')
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    useLayouts: false,
    read: false,
    compile: async function (_inputContent, inputPath) {
      const parsedInputPath = path.parse(inputPath)
      if (parsedInputPath.name.startsWith('_')) return

      const targets = browserslistToTargets(browserslist())

      return async () => {
        const { code } = await bundleAsync({
          filename: inputPath,
          minify: true,
          sourceMap: false,
          targets
        })
        return code
      }
    }
  })
}
