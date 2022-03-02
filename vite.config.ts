import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let base = "./";
  if (command === "serve") {
  }
  return {
    base: base,
    // base: "/",
    plugins: [react()],
    server: {
      host: "0.0.0.0",
    },
  };
});

