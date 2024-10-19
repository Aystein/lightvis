import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

console.log('vite.config.ts');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    lib: {
      entry: {
        hexworld: './packages/@lightvis/hexworld/src/index.ts',
      },
      formats: ['es'],
    },
    minify: 'terser'
  }
})
