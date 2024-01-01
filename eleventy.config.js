import markdownIt from 'markdown-it'
import markdownItAttrs from 'markdown-it-attrs'
import rssPlugin from '@11ty/eleventy-plugin-rss'
import cssPlugin from './_11ty/cssPlugin.js'
import { DateTime } from 'luxon'
import { readFile } from 'node:fs/promises'

const siteData = JSON.parse(await readFile('./src/_data/site.json'))
const podcastData = JSON.parse(await readFile('./src/_data/podcast.json'))

export default function (eleventyConfig) {
  const markdownItOptions = {
    html: true,
    typographer: true
  }
  const markdownLibrary = markdownIt(markdownItOptions).use(markdownItAttrs)
  eleventyConfig.setLibrary('md', markdownLibrary)

  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })
  eleventyConfig.addPlugin(cssPlugin)

  // shortcodes for podcast feed

  eleventyConfig.addShortcode('pageTitle', pageTitle => {
    const siteTitle = siteData.title
    if (pageTitle && pageTitle.length > 0 && pageTitle !== siteTitle) {
      return `${pageTitle} &middot; ${siteTitle}`
    } else {
      return siteTitle
    }
  })
  eleventyConfig.addShortcode('copyright', () => {
    const startingYear = podcastData.startingYear
    const currentYear = DateTime.now().year
    if (startingYear === currentYear) {
      return `© ${startingYear} ${podcastData.copyright}`
    } else {
      return `© ${startingYear}–${currentYear} ${podcastData.copyright}`
    }
  })
  eleventyConfig.addShortcode('feedLastBuildDate', () =>
    DateTime.now().toRFC2822()
  )
  eleventyConfig.addShortcode('episodeUrl', filename => {
    const episodePrefix = podcastData.episodePrefix
    return encodeURI(`${episodePrefix}${filename}`)
  })
  eleventyConfig.addShortcode('year', () => DateTime.now().year)
  eleventyConfig.addFilter('readableDate', date => {
    const result = DateTime.fromISO(date, {
      zone: 'UTC'
    })
    if (!result.isValid && process.env.ELEVENTY_ENV === 'production') {
      throw new Error(`Invalid date: ${date}`)
    }
    return result.setLocale('en-GB').toLocaleString(DateTime.DATE_HUGE)
  })

  eleventyConfig.addPassthroughCopy('src/js')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/css')
  eleventyConfig.addPassthroughCopy('src/fonts')
  eleventyConfig.addPassthroughCopy({ 'src/_icons': '/' })

  return {
    dir: {
      input: 'src'
    }
  }
}
