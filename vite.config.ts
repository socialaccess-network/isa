import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		emptyOutDir: true,
		lib: {
			entry: new URL('./src/index.ts', import.meta.url).pathname,
			name: '@sa-net/isa',
			fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
			formats: ['es', 'cjs'],
		},
	},
	plugins: [dts()],
})
