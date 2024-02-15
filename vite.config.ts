import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
    base: '/PaLiT-frontend/',
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react()],
})
