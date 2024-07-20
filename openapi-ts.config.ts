import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  base: 'http://localhost:8000',
  input: 'http://localhost:8000/openapi.json',
  output: './src/client',
  services: {
    asClass: true
  }
})
