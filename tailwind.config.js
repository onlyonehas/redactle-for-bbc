/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bbc: {
                    red: '#bb1919',
                    black: '#121212',
                    darkGrey: '#e9e9e9',
                    lightGrey: '#fdfdfd',
                    white: '#ffffff',
                    text: '#222222',
                    border: '#dcdcdc',
                    highlight: '#fff3c4',
                }
            },
            fontFamily: {
                sans: ['Helvetica', 'Arial', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
