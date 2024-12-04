import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      'google-protobuf': 'google-protobuf/google-protobuf.js',
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['rust-grpc'],
    },
  },
  optimizeDeps: {
    exclude: ['rust-grpc'],
  },
});
