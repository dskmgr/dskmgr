# dskmgr

## Developing

1. Install UI and Server Backend Dependencies using `pnpm install`
1. Install Tauri CLI using `cargo install tauri-cli`
1. Install Rust dependencies using `cargo build`

### Desktop App

1. `cargo tauri dev`

### Server / Web Version

1. `pnpm start`

## Building

### Desktop App

1. `PUBLIC_BACKEND_ENDPOINT="http://localhost:5173" cargo tauri build`

### Server / Web Version

ToDo, pack in Docker in the Future
