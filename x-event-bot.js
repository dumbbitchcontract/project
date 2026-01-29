import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { TwitterApi } from 'twitter-api-v2';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CAPTURE_SCRIPT = join(__dirname, 'shader-video', 'capture.js');
const VIDEO_PATH = join(__dirname, 'shader-video', 'output.mp4');

// Config
const MARKET_ADDRESS = process.env.MARKET_ADDRESS;
const RPC_URL = process.env.RPC_URL || 'https://eth.llamarpc.com';

// X API credentials
const xClient = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const abi = [
  {
    type: 'event',
    name: 'MetadataUpdated',
    inputs: [{ name: 'tokenId', type: 'uint256', indexed: true }],
  },
];

const client = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
});

function shortenAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function getOwner(tokenId) {
  const ownerAbi = [
    {
      type: 'function',
      name: 'ownerOf',
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      outputs: [{ name: '', type: 'address' }],
      stateMutability: 'view',
    },
  ];

  return await client.readContract({
    address: MARKET_ADDRESS,
    abi: ownerAbi,
    functionName: 'ownerOf',
    args: [tokenId], });
}

async function getToken(tokenId) {
  const tokenUriAbi = [
    {
      type: 'function',
      name: 'tokenURI',
      inputs: [{ name: 'tokenId', type: 'uint256' }],
      outputs: [{ name: '', type: 'string' }],
      stateMutability: 'view',
    },
  ];

  const uri = await client.readContract({
    address: MARKET_ADDRESS,
    abi: tokenUriAbi,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  // Handle base64 encoded JSON or fetch from URL
  let metadata;
  if (uri.startsWith('data:application/json;base64,')) {
    metadata = JSON.parse(atob(uri.split(',')[1]));
  } else {
    const res = await fetch(uri);
    metadata = await res.json();
  }

  const { name, substance, amount, animation_url } = metadata;
  return { name, substance, amount, animation_url };
}

function extractPayload(animationUrl) {
  const url = new URL(animationUrl);
  return url.searchParams.get('payload');
}

function renderVideo(payload) {
  console.log('Rendering video...');
  execFileSync('node', [CAPTURE_SCRIPT, payload], { stdio: 'inherit' });
  console.log('Video rendered.');
  return VIDEO_PATH;
}

async function postToX(message, videoPath) {
  try {
    const mediaId = await xClient.v1.uploadMedia(videoPath, { mimeType: 'video/mp4' });
    const tweet = await xClient.v2.tweet(message, { media: { media_ids: [mediaId] } });
    console.log(`Posted: ${message}`);
    return tweet;
  } catch (err) {
    console.error('Failed to post to X:', err.message);
  }
}

async function main() {
  console.log('Watching for MetadataUpdated events...');

  client.watchContractEvent({
    address: MARKET_ADDRESS,
    abi,
    eventName: 'MetadataUpdated',
    onLogs: async (logs) => {
      for (const log of logs) {
        const tokenId = log.args.tokenId;
        const wallet = await getOwner(tokenId);
        const { name, substance, amount, animation_url } = await getToken(tokenId);
        const txUrl = `https://etherscan.io/tx/${log.transactionHash}`;

        const message = `${shortenAddress(wallet)} just consumed a ${name} (${substance} ${amount})\n\n${txUrl}`;

        console.log(message);

        const payload = extractPayload(animation_url);
        const videoPath = renderVideo(payload);
        await postToX(message, videoPath);
      }
    },
    onError: (err) => console.error('Watch error:', err),
  });
}

main();

