import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  base: 'http://localhost:8000',
  input: 'http://localhost:8000/openapi.json',
  output: {
    path: './src/data/__generated__',
    lint: 'eslint',
    format: 'prettier'
  },
  services: {
    asClass: true
  }
})
