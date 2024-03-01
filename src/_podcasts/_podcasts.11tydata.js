import slugify from 'slugify'

export default {
  tags: ['podcast'],
  permalink: false,
  eleventyComputed: {
    image: data => {
      if (data.image) {
        return data.image
      }
      return `/img/podcasts/${slugify(data.title, { lower: true })}.jpg`
    }
  }
}
