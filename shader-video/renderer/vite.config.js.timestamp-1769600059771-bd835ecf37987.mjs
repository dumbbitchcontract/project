// vite.config.js
import { defineConfig } from "file:///home/deck/Downloads/pharmakon.market/renderer/node_modules/.pnpm/vite@5.4.9_terser@5.34.1/node_modules/vite/dist/node/index.js";
import { ViteMinifyPlugin } from "file:///home/deck/Downloads/pharmakon.market/renderer/node_modules/.pnpm/vite-plugin-minify@2.0.0_vite@5.4.9_terser@5.34.1_/node_modules/vite-plugin-minify/dist/index.cjs";
import glsl from "file:///home/deck/Downloads/pharmakon.market/renderer/node_modules/.pnpm/vite-plugin-glsl@1.3.2_rollup@4.24.0_vite@5.4.9_terser@5.34.1_/node_modules/vite-plugin-glsl/src/index.js";
import { resolve } from "path";
import { viteSingleFile } from "file:///home/deck/Downloads/pharmakon.market/renderer/node_modules/.pnpm/vite-plugin-singlefile@2.3.0_rollup@4.24.0_vite@5.4.9_terser@5.34.1_/node_modules/vite-plugin-singlefile/dist/esm/index.js";
var __vite_injected_original_dirname = "/home/deck/Downloads/pharmakon.market/renderer";
var vite_config_default = defineConfig({
  plugins: [
    //ViteMinifyPlugin(),
    glsl(),
    viteSingleFile()
  ],
  resolve: {
    alias: {
      "@imagemagick/magick-wasm/dist/magick.wasm": resolve(
        __vite_injected_original_dirname,
        "node_modules/@dlemstra/magick-native/magick.wasm"
      )
    }
  },
  assetsInclude: ["**/*.wasm"],
  build: {
    outDir: "dist",
    assetsDir: "assets"
  },
  server: {
    port: 1337
  },
  base: "./"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZWNrL0Rvd25sb2Fkcy9waGFybWFrb24ubWFya2V0L3JlbmRlcmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZWNrL0Rvd25sb2Fkcy9waGFybWFrb24ubWFya2V0L3JlbmRlcmVyL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2RlY2svRG93bmxvYWRzL3BoYXJtYWtvbi5tYXJrZXQvcmVuZGVyZXIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgVml0ZU1pbmlmeVBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1pbmlmeSdcbmltcG9ydCBnbHNsIGZyb20gJ3ZpdGUtcGx1Z2luLWdsc2wnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB2aXRlU2luZ2xlRmlsZSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zaW5nbGVmaWxlXCJcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdC8vVml0ZU1pbmlmeVBsdWdpbigpLFxuXHRcdGdsc2woKSxcblx0XHR2aXRlU2luZ2xlRmlsZSgpLFxuXHRdLFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAaW1hZ2VtYWdpY2svbWFnaWNrLXdhc20vZGlzdC9tYWdpY2sud2FzbSc6IHJlc29sdmUoXG5cdFx0XHRcdF9fZGlybmFtZSxcblx0XHRcdFx0J25vZGVfbW9kdWxlcy9AZGxlbXN0cmEvbWFnaWNrLW5hdGl2ZS9tYWdpY2sud2FzbSdcblx0XHRcdClcblx0XHR9XG5cdH0sXG5cdGFzc2V0c0luY2x1ZGU6IFsnKiovKi53YXNtJ10sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMTMzNyxcbiAgfSxcbiAgYmFzZTogJy4vJyxcbn0pXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFDelYsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUN4QixTQUFTLHNCQUFzQjtBQUovQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUE7QUFBQSxJQUVSLEtBQUs7QUFBQSxJQUNMLGVBQWU7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsT0FBTztBQUFBLE1BQ04sNkNBQTZDO0FBQUEsUUFDNUM7QUFBQSxRQUNBO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQUEsRUFDQSxlQUFlLENBQUMsV0FBVztBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsTUFBTTtBQUNSLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
