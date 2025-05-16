import slugify from 'slugify'

export default {
  tags: ['podcastEpisode'],
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true, remove: /[’']/g })}.jpg`
    },
    'episode.episodeNumber' (data) {
      if (data.episode?.episodeNumber) {
        return data.episode?.episodeNumber
      }

      const matchResult = data.page.fileSlug.match(/^episode-(\d+)/)
      if (matchResult) {
        return parseInt(matchResult[1])
      }
    }
  }
}
