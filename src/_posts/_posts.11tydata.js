import slugify from 'slugify'

export default {
  tags: ['podcastEpisode'],
  permalink: '/{{ episode.episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true, remove: /[’']/g })}.jpg`
    }
  }
}
