import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    emptyOutDir: true,
    outDir: './packages/@lightvis/hexworld/dist',
    lib: {
      entry: {
        index: './packages/@lightvis/hexworld/src/index.ts',
      },
      formats: ['es'],
    },
  }
})
