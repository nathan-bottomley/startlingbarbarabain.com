import slugify from 'slugify'

const isPageFromFuture = ({ date }) => date.getTime() > Date.now()
const isProduction = process.env.ELEVENTY_ENV === 'production'
const episodeFilePattern = /SBB (?<episodeNumber>\d+),\s.*\.mp3/

export default {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    permalink (data) {
      const { permalink, page } = data
      if (isPageFromFuture(page) && isProduction) return false
      return permalink
    },
    eleventyExcludeFromCollections (data) {
      const { eleventyExcludeFromCollections, page } = data
      if (isPageFromFuture(page) && isProduction) return true
      return eleventyExcludeFromCollections
    },
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true })}.jpg`
    },
    episodeFile (data) {
      for (const file of Object.keys(data.episodeInfo)) {
        if (file.match(episodeFilePattern).groups.episodeNumber === data.episodeNumber.toString()) {
          return file
        }
      }
    },
    episodeSize (data) {
      return data.episodeInfo[data.episodeFile]?.size
    },
    episodeDuration (data) {
      return data.episodeInfo[data.episodeFile]?.duration
    }
  }
}
