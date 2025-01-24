/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/styles/index.css", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                "custom-blue": "#7289da",
                "custom-dark-1": "#424549",
                "custom-dark-2": "#36393e",
                "custom-dark-3": "#282b30",
                "custom-dark-4": "#1e2124",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
