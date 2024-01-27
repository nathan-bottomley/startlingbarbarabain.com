import fs from 'node:fs/promises'
import { join } from 'node:path'
import { Duration } from 'luxon'
import mp3Duration from 'mp3-duration'
import hr from '@tsmx/human-readable'
import chalk from 'chalk'

// Get duration and size of all the podcast episodes

const baseEpisodesDirectory = 'episodes'

const episodesDirectory = join(process.cwd(), baseEpisodesDirectory)
const episodes = await fs.readdir(episodesDirectory)

let totalEpisodes = 0
let totalDuration = 0
let totalSize = 0

for (const episode of episodes) {
  if (!episode.endsWith('.mp3')) continue

  totalEpisodes++

  const episodePath = join(episodesDirectory, episode)
  const episodeStats = await fs.stat(episodePath)
  totalSize += episodeStats.size

  const buffer = await fs.readFile(episodePath)
  const duration = await mp3Duration(buffer)
  totalDuration += duration
}

const readableTotalDuration = Duration
  .fromMillis(totalDuration * 1000)
  .toFormat("d 'd' h 'h' m 'm' s.SSS 's'")
console.log(chalk.yellow(`${totalEpisodes} episodes; ${hr.fromBytes(totalSize)}; ${readableTotalDuration}`))
