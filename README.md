# ZSSN

Created with Vite React TypeScript.

## Installation
```shell
npm i
```

## Available npm commands
```shell
Lifecycle scripts included in frontend@0.0.0:
  test
    vitest

available via `npm run-script`:
  dev
    vite
  build
    tsc -b && vite build
  lint
    eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0
  preview
    vite preview
  generate-client
    openapi-ts
  test-ui
    vitest --ui
```

## .env
Required environmental variables for Google Maps to function:
```shell
VITE_GOOGLE_MAPS_API_KEY=
VITE_GOOGLE_MAP_ID=
```
## Tests
I've covered the SignUp route component as an example. As per npm commands, you can run tests with
```shell
npm test
```
