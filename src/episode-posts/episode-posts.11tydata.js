import slugify from 'slugify'

export default {
  tags: ['podcastEpisode'],
  layout: 'layouts/post.liquid',
  includeAudioPlayer: true,
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title, { lower: true, remove: /[’',]/g })}.jpg`
    }
  }
}
