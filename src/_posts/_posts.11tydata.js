// const isPageFromFuture = ({ date }) => date.getTime() > Date.now()

const isProduction = process.env.ELEVENTY_ENV === 'production'

module.exports = {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    episodeFile: data => `SBB ${data.episodeNumber}, ${data.title}.mp3`,
    episodeSize: data => {
      if (isProduction && !data.episodeInfo[data.episodeFile]) {
        console.error(`Episode data for ${data.episodeFile} not found`)
      }
      return data.episodeInfo[data.episodeFile]?.size
    },
    episodeDuration: data => {
      if (isProduction && !data.episodeInfo[data.episodeFile]) {
        console.error(`Episode data for ${data.episodeFile} not found`)
      }
      return data.episodeInfo[data.episodeFile]?.duration
    }
  }
}
