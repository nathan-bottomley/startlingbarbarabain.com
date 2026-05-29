import slugify from '@sindresorhus/slugify'

export default {
  tags: ['podcast'],
  eleventyComputed: {
    permalink: false,
    image: data => {
      if (data.image) {
        return data.image
      }
      return `/img/podcasts/${slugify(data.title)}.jpg`
    }
  }
}
