module.exports = {
  tags: ['post'],
  permalink: '/{{ episodeNumber }}/',
  eleventyComputed: {
    episodeFile: data => `SBB ${data.episodeNumber}, ${data.title}.mp3`
  }
}
