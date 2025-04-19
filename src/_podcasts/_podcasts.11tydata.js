import slugify from 'slugify'

export default {
  tags: ['podcast'],
  eleventyComputed: {
    permalink: false,
    image: data => {
      if (data.image) {
        return data.image
      }
      return `/img/podcasts/${slugify(data.title, { lower: true })}.jpg`
    }
  }
}
