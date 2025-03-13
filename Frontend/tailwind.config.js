// export default {
//     theme: {
//       extend: {
//         animation: {
//           "fade-slide": "fadeSlide 0.5s ease-out forwards",
//         },
//         keyframes: {
//           fadeSlide: {
//             "0%": { opacity: 0, transform: "translateY(-10px)" },
//             "100%": { opacity: 1, transform: "translateY(0)" },
//           },
//         },
//       },
//     },
//   };


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts}"], 
  theme: {
    extend: {
      animation: {
        "fade-slide": "fadeSlide 0.5s ease-out forwards",
      },
      keyframes: {
        fadeSlide: {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

  