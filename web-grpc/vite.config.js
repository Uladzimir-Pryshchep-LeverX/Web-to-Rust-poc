import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'google-protobuf': 'google-protobuf/google-protobuf.js',
    },
  },
});