import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],
	base: mode === 'production' ? '/wikipedia-viewer/' : '/',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
}));
