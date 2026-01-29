import { defineConfig } from 'vite'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import glsl from 'vite-plugin-glsl'
import { resolve } from 'path';
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
	plugins: [
		ViteMinifyPlugin(),
		glsl(),
		viteSingleFile(),
	],
	resolve: {
		alias: {
			'@imagemagick/magick-wasm/dist/magick.wasm': resolve(
				__dirname,
				'node_modules/@dlemstra/magick-native/magick.wasm'
			)
		}
	},
	assetsInclude: ['**/*.wasm'],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 1337,
  },
  base: './',
})

