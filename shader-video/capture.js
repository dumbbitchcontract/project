const { spawn } = require('child_process');
const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const WIDTH = 750;
const HEIGHT = 750;
const FPS = 30;
const DURATION = 2;
const TOTAL_FRAMES = FPS * DURATION;
const OUTPUT = path.join(__dirname, 'output.mp4');

async function main() {
  const payload = process.argv[2];
  if (!payload) {
    console.error('usage: node capture.js <payload>');
    process.exit(1);
  }

  // serve the built renderer
  const app = express();
  app.use(express.static(path.join(__dirname, 'renderer', 'dist')));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  console.log(`serving on port ${port}`);

  // launch browser
  const browser = await puppeteer.launch({
    args: [
      '--use-gl=egl',
      '--no-sandbox',
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.goto(`http://localhost:${port}/index.html?payload=${encodeURIComponent(payload)}`, {
    waitUntil: 'networkidle0',
  });

  await page.waitForFunction('typeof window.setTime === "function"');

  // start ffmpeg
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-f', 'image2pipe',
    '-i', '-',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '18',
    OUTPUT,
  ]);

  ffmpeg.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('frame=')) process.stderr.write(`\r${msg.trim()}`);
  });

  console.log(`capturing ${TOTAL_FRAMES} frames at ${FPS}fps...`);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((time) => window.setTime(time), t);
    const frame = await page.screenshot({ type: 'png' });

    const ok = ffmpeg.stdin.write(frame);
    if (!ok) await new Promise((r) => ffmpeg.stdin.once('drain', r));

    if ((i + 1) % FPS === 0) {
      console.log(`  ${Math.round(((i + 1) / TOTAL_FRAMES) * 100)}%`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));

  await browser.close();
  server.close();
  console.log(`\ndone → ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
