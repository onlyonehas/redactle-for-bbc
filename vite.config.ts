import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/redactle-for-bbc/',
    server: {
        proxy: {
            '/news': {
                target: 'https://www.bbc.co.uk',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/news/, '/news')
            }
        }
    }
});
