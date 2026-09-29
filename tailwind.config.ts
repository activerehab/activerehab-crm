import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: "#25D366",
          DEFAULT: "#128C7E",
          dark: "#075E54",
          teal: "#00A884",
          bg: "#EFEAE2",
          chatBubbleOut: "#D9FDD3",
          chatBubbleIn: "#FFFFFF",
        },
        clinic: {
          primary: "#0E7490", // Cyan/Teal medical grade
          accent: "#0284C7",
          dark: "#0F172A",
          surface: "#F8FAFC",
        }
      },
    },
  },
  plugins: [],
};
export default config;
