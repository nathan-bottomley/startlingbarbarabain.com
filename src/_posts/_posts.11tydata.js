import slugify from 'slugify'

const episodeFilePattern = /SBB (?<episodeNumber>\d+),\s.*\.mp3/

export default {
  tags: ['podcastEpisode'],
  permalink: '/{{ episode.episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true, remove: /[’']/g })}.jpg`
    },
    'episode.filename': data => {
      for (const file of Object.keys(data.episodesData)) {
        if (file.match(episodeFilePattern).groups.episodeNumber === data.episode.episodeNumber.toString()) {
          return file
        }
      }
    }
  }
}
