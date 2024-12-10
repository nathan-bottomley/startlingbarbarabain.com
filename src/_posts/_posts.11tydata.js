import slugify from 'slugify'

const episodeFilePattern = /SBB (?<episodeNumber>\d+),\s.*\.mp3/

export default {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true, remove: /[’']/g })}.jpg`
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
    },
    episodeDurationInSeconds (data) {
      return data.episodeInfo[data.episodeFile]?.durationInSeconds
    }
  }
}
