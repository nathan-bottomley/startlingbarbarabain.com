import slugify from 'slugify'

const isPageFromFuture = ({ date }) => date.getTime() > Date.now()
const isProduction = process.env.ELEVENTY_ENV === 'production'

export default {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    permalink: data => {
      const { permalink, page } = data
      if (isPageFromFuture(page) && isProduction) return false
      return permalink
    },
    eleventyExcludeFromCollections: data => {
      const { eleventyExcludeFromCollections, page } = data
      if (isPageFromFuture(page) && isProduction) return true
      return eleventyExcludeFromCollections
    },
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title)}.jpg`
    },
    episodeFile: data => `SBB ${data.episodeNumber}, ${data.title}.mp3`,
    episodeSize: data => {
      if (isProduction && !data.episodeInfo[data.episodeFile]) {
        console.error(`Episode size data for ${data.title} not found`)
      }
      return data.episodeInfo[data.episodeFile]?.size
    },
    episodeDuration: data => {
      if (isProduction && !data.episodeInfo[data.episodeFile]) {
        console.error(`Episode duration data for ${data.title} not found`)
      }
      return data.episodeInfo[data.episodeFile]?.duration
    }
  }
}
