/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/*.{html, js, ts, vue}',
    './src/components/*.{html, js, ts, vue}',
    './src/App.vue',
    './index.html'
  ],
  theme: {
    extend: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    },
  },
  plugins: [],
}

