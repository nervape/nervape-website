// import GlobalPolyFill from '@esbuild-plugins/node-globals-polyfill';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => {
  let base = "/";
  return {
    base: base,
    envDir: "./",
    plugins: [react()],
    mode: "development",
    server: {
      host: "0.0.0.0",
      port: 3000,
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
    },
    define: {
      'process.env': {}
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        process: require.resolve('process/browser'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify')
      }
    },
    build: {
      minify: "esbuild",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        }
      },
      commonjsOptions: {
        include: [],
        transformMixedEsModules: true
      }
    },
    esbuild: {
      // drop: ["console", "debugger"]
    },
    optimizeDeps: {
      disabled: false
    }
  };
});
