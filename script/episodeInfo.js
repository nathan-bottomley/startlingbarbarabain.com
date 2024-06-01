import fs from 'node:fs/promises'
import { join } from 'node:path'
import { Duration } from 'luxon'
import mp3Duration from 'mp3-duration'

const convertSecondsToDuration = seconds =>
  Duration.fromMillis(seconds * 1000).toFormat('h:mm:ss')

const episodesDirectory = join(process.cwd(), 'episodes')
const episodes = await fs.readdir(episodesDirectory)
const dataDirectory = join(process.cwd(), 'src/_data')

const episodeInfo = {}
for (const episode of episodes) {
  if (!episode.endsWith('.mp3')) continue

  const episodePath = join(episodesDirectory, episode)
  const episodeStats = await fs.stat(episodePath)
  const buffer = await fs.readFile(episodePath)
  const duration = await mp3Duration(buffer)
  episodeInfo[episode] = {
    size: episodeStats.size,
    duration: convertSecondsToDuration(duration)
  }
}

const jsonOutput = JSON.stringify(episodeInfo, null, 2)
await fs.writeFile(join(dataDirectory, 'episodeInfo.json'), jsonOutput)

console.log('Finished generating episode info')
