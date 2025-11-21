# dskmgr

## Developing

1. Install UI and Server Backend Dependencies using `pnpm install`
1. Install Tauri CLI using `cargo install tauri-cli`

### Server / Web Version & App

1. `pnpm start`

### Server / Web Version only

1. `pnpm run start:server-only`

## Building

### Desktop App

1. `PUBLIC_BACKEND_ENDPOINT="http://localhost:6283" pnpm run build:app`

### Server / Web Version

1. `pnpm run build:node`

## Deploy

### Server / Web Version

1. `pnpm run serve`
