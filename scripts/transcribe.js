import { readdirSync, existsSync } from 'fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const EPISODES_DIR = './episodes'
const TRANSCRIPTS_DIR = './src/transcripts'
const CONCURRENCY = 4
const overwrite = process.argv.includes('--overwrite')

function withEpisode (file, fn) {
  const match = file.match(/SBB (\d+),/)?.[1]
  return match ? fn(match) : null
}

const transcriptPath = file => withEpisode(file, (episode) =>
  `${TRANSCRIPTS_DIR}/sbb-ep${episode}-transcript.vtt`
)

const episodeIdentifier = file => withEpisode(file, episode => episode)

const episodes = readdirSync(EPISODES_DIR)
  .filter(f => f.endsWith('.mp3'))
  .filter(file => {
    const possibleTranscriptPath = transcriptPath(file)
    if (!possibleTranscriptPath) return false
    return overwrite || !existsSync(possibleTranscriptPath)
  })

if (episodes.length === 0) {
  console.log('All episodes already transcribed.')
  process.exit(0)
}

console.log(`Transcribing ${episodes.length} episode(s)...`)

async function transcribe (file) {
  const output = transcriptPath(file)
  const identifier = episodeIdentifier(file)
  console.log(`Transcribing ${identifier}...`)
  await execFileAsync('yap', ['transcribe', '--vtt', '-m', '600', '-o', output, `${EPISODES_DIR}/${file}`])
  console.log(`Done: ${identifier}`)
}

const queue = [...episodes]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const file = queue.shift()
      try {
        await transcribe(file)
      } catch (err) {
        console.error(err.message)
      }
    }
  })
)

console.log('All done.')
