const rssPlugin = require('@11ty/eleventy-plugin-rss')
const podcastData = require('./src/_data/podcast')
const { DateTime } = require('luxon')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin)

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

  return {
    dir: {
      input: 'src'
    }
  }
}
