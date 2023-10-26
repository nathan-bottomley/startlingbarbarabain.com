module.exports = {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  layout: 'layouts/post.liquid',
  eleventyComputed: {
    episodeFile: data => `SBB ${data.episodeNumber}, ${data.title}.mp3`
  }
}
