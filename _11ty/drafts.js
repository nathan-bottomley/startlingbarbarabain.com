export default eleventyConfig => {
  eleventyConfig.addGlobalData('eleventyComputed.permalink', () => {
    return data => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false
      } else {
        return data.permalink
      }
    }
  })
  eleventyConfig.addGlobalData('eleventyComputed.eleventyExcludeFromCollections', () => {
    return data => {
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return true
      } else {
        return data.eleventyExcludeFromCollections
      }
    }
  })
  let logged = false
  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true
    }
    if (!logged) {
      if (process.env.BUILD_DRAFTS) {
        console.log('Including drafts.')
      } else {
        console.log('Excluding drafts.')
      }
      logged = true
    }
  })
}
