import { readFile } from 'node:fs/promises'
import { DateTime } from 'luxon'
import rssPlugin from '@11ty/eleventy-plugin-rss'

const podcastData = JSON.parse(await readFile('./src/_data/podcast.json'))

const isProduction = process.env.ELEVENTY_ENV === 'production'

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
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
  eleventyConfig.addShortcode('episodeUrl', function (filename) {
    if (filename === undefined && isProduction) {
      console.error(`Episode filename missing on ${this.page.inputPath}`)
    }
    const episodePrefix = podcastData.episodePrefix
    return encodeURI(`${episodePrefix}${filename}`)
  })
  eleventyConfig.addShortcode('year', () => DateTime.now().year)
  eleventyConfig.addFilter('readableDate', function (date) {
    if (date instanceof Date) {
      date = date.toISOString()
    }
    const result = DateTime.fromISO(date, {
      zone: 'UTC'
    })
    return result.setLocale('en-GB').toLocaleString(DateTime.DATE_HUGE)
  })
}
