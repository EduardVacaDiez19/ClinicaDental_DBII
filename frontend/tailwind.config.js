/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky blue
                secondary: '#0f172a', // Slate 900
                accent: '#38bdf8', // Light sky blue
            }
        },
    },
    plugins: [],
}
