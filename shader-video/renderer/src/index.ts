import { Renderer, Composer, getPixelRatio, loadBitmap, State } from './utils/graphics';
import {
	deriveSubstanceClass,
	deriveSubstanceSeed,
	parseParams,
	processColor,
	processShape,
	processAmount
} from './utils/metadata';

async function main() {
	const container = document.querySelector('main')!;
	const pixelRatio = getPixelRatio();

	const width = (window.frameElement as HTMLElement)?.offsetWidth || container.offsetWidth;
	const height = width;

	const url = new URL(window.location.href);
	const payload = url.searchParams.get('payload');

	if (!payload) {
		document.body.className = 'loaded';
		document.querySelector('button')!.textContent = 'No payload in URL. Add ?payload=...';
		return;
	}

	const canvas = document.querySelector('canvas')!;
	const renderer = new Renderer(canvas, width, height);
	const params = parseParams(payload);

	const color = processColor(params.color);

	const composerCanvas = document.createElement('canvas');
	composerCanvas.width = width * pixelRatio;
	composerCanvas.height = height * pixelRatio;
	const composer = new Composer(composerCanvas);

	const shapeURL = `shape/${params.shape}.png`;
	const emblemURL = `emblem/${params.emblem}.png`;
	const composerParams = processShape(params.shape);

	const [shape, emblem] = await Promise.all([loadBitmap(shapeURL), loadBitmap(emblemURL)]);

	const substanceClass = deriveSubstanceClass(params.substance);
	const seed = deriveSubstanceSeed(params.substance);

	await composer.compose({ shape, emblem, composerParams, color });

	renderer.setParams({
		image: composerCanvas,
		substanceClass,
		color,
		seed,
		amount: processAmount(Number(params.amount))
	});

	renderer.setState(params.consumed ? State.Consumed : State.Idle);
	renderer.render();
	document.body.className = 'loaded';

	(window as any).setTime = (t: number) => {
		renderer.renderFrame(t);
	};
}

main().catch(console.error);
