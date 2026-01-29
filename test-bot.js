import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_SCRIPT = join(__dirname, 'shader-video', 'capture.js');
const VIDEO_PATH = join(__dirname, 'shader-video', 'output.mp4');

const TEST_PAYLOAD = process.argv[2] || 'MzFfR3JlZW5fRm9saWFfM19EZWx0YS00LVRIQ18wX18w';
const TEST_ANIMATION_URL = `https://example.com/?payload=${TEST_PAYLOAD}`;

// simulate extractPayload
function extractPayload(animationUrl) {
  const url = new URL(animationUrl);
  return url.searchParams.get('payload');
}

// simulate the event handler flow
async function test() {
  // 1. simulate token metadata
  const tokenData = {
    name: 'Test Token #31',
    substance: 'Delta-4-THC',
    amount: '0',
    animation_url: TEST_ANIMATION_URL,
  };
  console.log('Token metadata:', tokenData);

  // 2. extract payload
  const payload = extractPayload(tokenData.animation_url);
  console.log('Extracted payload:', payload);

  // 3. render video
  console.log('Rendering video...');
  execFileSync('node', [CAPTURE_SCRIPT, payload], { stdio: 'inherit' });
  console.log(`Video rendered: ${VIDEO_PATH}`);

  // 4. dry-run post
  const message = `0x1234...5678 just consumed a ${tokenData.name} (${tokenData.substance} ${tokenData.amount})

https://etherscan.io/tx/0xfake`;
  console.log('\n--- Would post to X ---');
  console.log(message);
  console.log(`Media: ${VIDEO_PATH}`);
  console.log('--- End ---');
}

test().catch(console.error);
