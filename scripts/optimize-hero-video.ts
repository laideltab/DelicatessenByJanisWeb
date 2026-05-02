/**
 * Optimize a source video into a web-friendly hero loop + poster JPG.
 *
 * Usage:
 *   npm run optimize:hero -- "<input path>" [--start <sec>] [--duration <sec>]
 *
 * Examples:
 *   npm run optimize:hero -- "c:/Users/laide/Downloads/source.mp4"
 *   npm run optimize:hero -- "./input.mp4" --start 12 --duration 8
 *
 * Outputs:
 *   public/video/hero.mp4         (H.264, 720p vertical, no audio, faststart)
 *   public/video/hero-poster.jpg  (frame from the middle of the clip)
 */
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { existsSync, mkdirSync, statSync } from "node:fs"
import path from "node:path"
import ffmpegPath from "ffmpeg-static"

const execFileP = promisify(execFile)

function parseArgs() {
  const argv = process.argv.slice(2)
  const positional: string[] = []
  let start = 0
  let duration = 8
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--start") {
      start = Number(argv[++i])
    } else if (a === "--duration") {
      duration = Number(argv[++i])
    } else {
      positional.push(a)
    }
  }
  return { input: positional[0], start, duration }
}

async function main() {
  const { input, start, duration } = parseArgs()

  if (!input) {
    console.error("Usage: optimize-hero-video <input> [--start N] [--duration N]")
    process.exit(1)
  }
  if (!ffmpegPath) {
    console.error("ffmpeg-static did not provide a binary path on this platform.")
    process.exit(1)
  }
  if (!existsSync(input)) {
    console.error(`Input not found: ${input}`)
    process.exit(1)
  }

  const inputSizeMb = (statSync(input).size / (1024 * 1024)).toFixed(1)
  console.log(`→ Source: ${input} (${inputSizeMb} MB)`)
  console.log(`  Trim: start=${start}s, duration=${duration}s`)

  const outDir = path.join(process.cwd(), "public", "video")
  mkdirSync(outDir, { recursive: true })

  const outVideo = path.join(outDir, "hero.mp4")
  const outPoster = path.join(outDir, "hero-poster.jpg")

  // 1. Encode H.264 vertical 9:16 at 720p, no audio, faststart for web streaming.
  //    `-ss` before `-i` is fast (keyframe seek); `-t` caps duration.
  console.log("→ Encoding hero.mp4…")
  const encodeArgs = [
    "-y",
    "-ss", String(start),
    "-i", input,
    "-t", String(duration),
    "-an",
    "-vf", "scale='min(720,iw)':-2:flags=lanczos",
    "-c:v", "libx264",
    "-crf", "28",
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    outVideo,
  ]
  await execFileP(ffmpegPath, encodeArgs, { maxBuffer: 1024 * 1024 * 64 })

  const videoSizeMb = (statSync(outVideo).size / (1024 * 1024)).toFixed(2)
  console.log(`✓ ${outVideo} (${videoSizeMb} MB)`)

  // 2. Capture poster from the middle of the clip.
  console.log("→ Extracting hero-poster.jpg…")
  const posterArgs = [
    "-y",
    "-ss", String(Math.max(0.5, duration / 2)),
    "-i", outVideo,
    "-vframes", "1",
    "-q:v", "4",
    outPoster,
  ]
  await execFileP(ffmpegPath, posterArgs, { maxBuffer: 1024 * 1024 * 16 })

  const posterSizeKb = (statSync(outPoster).size / 1024).toFixed(1)
  console.log(`✓ ${outPoster} (${posterSizeKb} KB)`)

  console.log("\nDone. Refresh /  to see the hero video.")
}

main().catch((err) => {
  console.error("\n✗ Failed:", err.stderr ?? err.message ?? err)
  process.exit(1)
})
