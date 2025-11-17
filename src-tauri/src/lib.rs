use tauri::{WebviewUrl, WebviewWindowBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // BUGFIX: use port 5173 in cargo run dev
    // NOTE: this will break cargo run build --debug
    #[cfg(debug_assertions)]
    let port: u16 = 5173;

    // BUGFIX: use port 9527 in cargo run build
    #[cfg(not(debug_assertions))]
    let port: u16 = 9527;

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .setup(move |app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            let url = format!("http://localhost:{}", port).parse()?;
            WebviewWindowBuilder::new(app, "main".to_string(), WebviewUrl::External(url))
                .title("Localhost Example")
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
