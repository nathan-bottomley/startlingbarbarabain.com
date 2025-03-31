import podcaster from 'eleventy-plugin-podcaster'
import { IdAttributePlugin } from '@11ty/eleventy'
import lightningCSS from '@11tyrocks/eleventy-plugin-lightningcss'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import markdownIt from 'markdown-it'

export default function (eleventyConfig) {
  const markdownLibrary = markdownIt({
    html: true,
    typographer: true
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

  eleventyConfig.addPlugin(podcaster, {
    episodeFilenamePattern: /SBB (?<episodeNumber>\d+),\s.*\.mp3/,
    handleDrafts: true,
    readableDateLocale: 'en-AU',
    calculatePageTitle: true,
    handleEpisodePermalinks: true
  })

  eleventyConfig.addPlugin(IdAttributePlugin)
  eleventyConfig.addPlugin(lightningCSS)
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'jpeg'],
    widths: [331, 662],
    defaultAttributes: {
      decoding: 'async',
      sizes: '(min-width: 400px) 331px, calc(78.75vw + 32px)'
    }
  })

  eleventyConfig.addCollection('podcast', collectionAPI => {
    const podcasts = collectionAPI.getFilteredByTag('podcast')
    const podcastsWithPosition = podcasts
      .filter(podcast => podcast.data.position)
      .sort((a, b) => a.data.position - b.data.position)
    const podcastsWithoutPosition = podcasts
      .filter(podcast => !podcast.data.position)
      .sort((a, b) => b.data.firstBroadcast - a.data.firstBroadcast)
    return podcastsWithPosition.concat(podcastsWithoutPosition)
  })

  eleventyConfig.addPassthroughCopy('src/js')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/fonts')
  eleventyConfig.addPassthroughCopy({ 'src/_icons': '/' })
  eleventyConfig.addPassthroughCopy('src/_headers')
  eleventyConfig.addPassthroughCopy('src/_redirects')
}

export const config = {
  dir: {
    input: 'src'
  }
}
