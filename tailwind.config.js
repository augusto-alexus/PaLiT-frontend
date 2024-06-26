/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'cs-primary': '#11698E',
                'cs-secondary': '#16C79A',
                'cs-text-dark': '#212223',
                'cs-text-neutral': '#5B5D5F',
                'cs-text-light': '#F6FAFC',
                'cs-accent-blue': '#1B364D',
                'cs-accent-green': '#0C614B',
                'cs-neutral': '#7E9B94',
                'cs-bg-white': '#FFFFFF',
                'cs-bg-neutral': '#ECF3F5',
                'cs-warning': '#CF3C0E',
                'cs-disabled': '#657671',
                'cs-additional-gray': '#9BA5A2',
                'cs-additional-green': '#A4C716',
                'cs-link': '#747BFF',
            },
            animation: {
                'spin-slow': 'spin 1.5s linear infinite',
            },
        },
    },
    plugins: [],
}
