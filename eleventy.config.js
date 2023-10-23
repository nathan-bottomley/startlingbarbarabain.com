const rssPlugin = require('@11ty/eleventy-plugin-rss')
const cssPlugin = require('./_11ty/cssPlugin')
const podcastData = require('./src/_data/podcast')
const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })
  eleventyConfig.addPlugin(cssPlugin)

  // shortcodes for podcast feed

  eleventyConfig.addShortcode('feedCopyright', () => {
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

  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/css')

  return {
    dir: {
      input: 'src'
    }
  }
}
