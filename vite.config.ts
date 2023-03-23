import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			name: '@sa-net/isa',
			entry: 'src/index.ts',
			formats: ['es', 'cjs'],
			fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs'),
		},
		rollupOptions: {
			external: ['@michealpearce/utils'],
			output: {
				exports: 'named',
			},
		},
	},
})
