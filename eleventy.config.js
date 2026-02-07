import Podcaster from 'eleventy-plugin-podcaster'
import { IdAttributePlugin } from '@11ty/eleventy'
import cssPlugin from './_11ty/css-plugin.js'
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img'
import markdownIt from 'markdown-it'
import 'dotenv/config'

export default function (eleventyConfig) {
  const markdownLibrary = markdownIt({
    html: true,
    typographer: true
  })
  eleventyConfig.setLibrary('md', markdownLibrary)

  eleventyConfig.addPlugin(Podcaster, {
    handleDrafts: true,
    handlePageTitles: true,
    s3Storage: {
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET
    }
  })

  eleventyConfig.addPlugin(IdAttributePlugin)
  eleventyConfig.addPlugin(cssPlugin)
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['webp', 'jpeg']
  })

  eleventyConfig.addCollection('podcast', collectionAPI => {
    const podcasts = collectionAPI.getFilteredByTag('podcast')
    const podcastsWithPosition = podcasts
      .filter(podcast => podcast.data.position)
      .sort((a, b) => a.data.position - b.data.position)
    const podcastsWithoutPosition = podcasts
      .filter(podcast => !podcast.data.position)
      .sort((a, b) => b.data.firstBroadcast - a.data.firstBroadcast)
    return podcastsWithPosition.concat(podcastsWithoutPosition)
  })

  eleventyConfig.addCollection('sitemap', collectionAPI => {
    return collectionAPI.getAll().filter(x => x.data.permalink)
  })

  eleventyConfig.addPassthroughCopy('src/js')
  eleventyConfig.addPassthroughCopy('src/img')
  eleventyConfig.addPassthroughCopy('src/fonts')
  eleventyConfig.addPassthroughCopy({ 'src/icons': '/' })
  eleventyConfig.addPassthroughCopy('src/_headers')
  eleventyConfig.addPassthroughCopy('src/_redirects')
}

export const config = {
  dir: {
    input: 'src'
  }
}
