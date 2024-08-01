import { readFile } from 'node:fs/promises'
import podcastPlugin from './_11ty/podcast-plugin.js'
import lightningCSS from '@11tyrocks/eleventy-plugin-lightningcss'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import markdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'

const siteData = JSON.parse(await readFile('./src/_data/site.json'))

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(podcastPlugin)
  eleventyConfig.addPlugin(lightningCSS)
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'jpeg'],
    widths: [331, 662],
    defaultAttributes: {
      decoding: 'async',
      sizes: '(min-width: 400px) 331px, calc(78.75vw + 32px)'
    }
  })

  let hasLoggedAboutDrafts = false
  eleventyConfig.addPreprocessor('drafts', 'md', (data, content) => {
    if (!hasLoggedAboutDrafts) {
      if (process.env.BUILD_DRAFTS) {
        console.log('Including drafts.')
      } else {
        console.log('Excluding drafts.')
      }
      hasLoggedAboutDrafts = true
    }
    if (data.draft && !process.env.BUILD_DRAFTS) {
      return false
    }
  })
  
  const markdownLibrary = markdownIt({
    html: true,
    typographer: true
  }).use(markdownItAttrs)
  eleventyConfig.setLibrary('md', markdownLibrary)

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

  eleventyConfig.addShortcode('pageTitle', pageTitle => {
    const siteTitle = siteData.title
    if (pageTitle && pageTitle.length > 0 && pageTitle !== siteTitle) {
      return `${pageTitle} &middot; ${siteTitle}`
    } else {
      return siteTitle
    }
  })

  eleventyConfig.addPassthroughCopy('src/js')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/fonts')
  eleventyConfig.addPassthroughCopy({ 'src/_icons': '/' })

  return {
    dir: {
      input: 'src'
    }
  }
}
