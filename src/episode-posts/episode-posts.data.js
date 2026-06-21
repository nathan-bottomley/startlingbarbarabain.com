import slugify from '@sindresorhus/slugify'

export default {
  tags: ['podcastEpisode'],
  layout: 'layouts/post.liquid',
  includeAudioPlayer: true,
  eleventyComputed: {
    imageFile (data) {
      if (data.imageFile) return data.imageFile

      return `${slugify(data.title)}.jpg`
    }
  }
}
