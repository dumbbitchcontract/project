import * as THREE from 'three';
import vertexShader from '../glsl/vertex.vert';
import fragmentShader from '../glsl/fragment.frag';
export enum State {
  Idle,
  Effervescence,
  Consumed
}

type RGBColor = [number, number, number];

interface Attributes {
  image: HTMLCanvasElement;
  color: RGBColor;
  seed: number;
  amount: number;
  substanceClass: string;
}

export class Renderer {
  private material: THREE.ShaderMaterial;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.OrthographicCamera;
  private scene: THREE.Scene;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      autoClear: false,
      preserveDrawingBuffer: true,
      canvas
    });

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10000);
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uImage: { value: undefined },
        uColor: { value: undefined },
        uAmount: { value: undefined },
        uSeed: { value: undefined },
        uResolution: { value: undefined },
        uState: { value: undefined },
        uTime: { value: undefined }
      },
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, this.material);

    this.scene.add(mesh);

    this.setSize(width, height);
  }

  render() {
    const clock = new THREE.Clock();

    this.renderer.setAnimationLoop(() => {
      clock.getDelta();
      this.material.uniforms.uTime.value = clock.elapsedTime;

      this.renderer.render(this.scene, this.camera);
    });
  }

  renderFrame(time: number) {
    this.renderer.setAnimationLoop(null);
    this.material.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }

  setSize(width: number, height: number) {
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.material.uniforms.uResolution.value = new THREE.Vector2(
      width * getPixelRatio(),
      height * getPixelRatio()
    );
  }

  setParams({ image, color, amount, substanceClass, seed }: Attributes) {
    const texture = new THREE.CanvasTexture(image);

    this.material.uniforms.uImage.value = texture;
    this.material.uniforms.uColor.value = new THREE.Color(`rgb(${color.join(',')})`);

    this.material.uniforms.uAmount.value = amount;
    this.material.uniforms.uSeed.value = seed;

    console.log('********************');
    console.log('Amount:');
    console.log(this.material.uniforms.uAmount.value);
    console.log('********************');

    console.log('********************');
    console.log('Seed:');
    console.log(this.material.uniforms.uSeed.value);
    console.log('********************');

		console.log('********************');
    console.log('Seed:');
    console.log(this.material.uniforms.uColor.value);
    console.log('********************');

    const completeShader = fragmentShader.replace('<SUBSTANCE_CLASS>', substanceClass);
    this.material.fragmentShader = completeShader;
  }

  setState(state: State) {
    this.material.uniforms.uState.value = state;
  }

  destroy() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

export class Composer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  //private magick;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', {
      willReadFrequently: true
    }) as CanvasRenderingContext2D;
  }

  public async compose({ emblem, shape, color, composerParams }) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.drawImage(
      emblem,
      composerParams.x * this.canvas.width,
      composerParams.y * this.canvas.height,
      composerParams.width * this.canvas.height,
      composerParams.height * this.canvas.height
    );
    const emblemImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const emblemData = emblemImageData.data;
    const outEmblemImageData = new ImageData(this.canvas.width, this.canvas.height);
    const outEmblemData = outEmblemImageData.data;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.drawImage(shape, 0, 0, this.canvas.width, this.canvas.height);
    const shapeImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const shapeData = shapeImageData.data;
    const outShapeImageData = new ImageData(this.canvas.width, this.canvas.height);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const outImageData = new ImageData(this.canvas.width, this.canvas.height);
    const outData = outImageData.data;

    const emblemColor = darkenColor(color);
    const shapeColor = color;

    for (let i = 0; i < shapeData.length; i += 4) {
      if (emblemData[i] === 0) {
        outData[i] = 0;
        outData[i + 1] = 0;
        outData[i + 2] = 0;
        outData[i + 3] = 255;
      }
      if (shapeData[i] === 255) {
        outData[i] = shapeColor[0];
        outData[i + 1] = shapeColor[1];
        outData[i + 2] = shapeColor[2];
        outData[i + 3] = 255;
      }
      if (emblemData[i] === 255) {
        outData[i] = emblemColor[0];
        outData[i + 1] = emblemColor[1];
        outData[i + 2] = emblemColor[2];
        outData[i + 3] = 255;
      }
    }

    this.context.putImageData(new ImageData(outData, this.canvas.width, this.canvas.height), 0, 0);
  }
}

export function darkenColor(color) {
  const multitplier = 0.0;

  return [color[0] * multitplier, color[1] * multitplier, color[2] * multitplier];
}

export function getPixelRatio(): number {
  return window.devicePixelRatio | 1;
}

export async function loadBitmap(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = src;

    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });
}
