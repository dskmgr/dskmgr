use tauri::{WebviewUrl, WebviewWindowBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let is_dev = cfg!(debug_assertions);

    let mut builder = tauri::Builder::default();
    let port = if is_dev { 5173 } else { 9527 };

    if !is_dev {
        builder = builder.plugin(tauri_plugin_localhost::Builder::new(port).build());
    }

    builder
        .setup(move |app| {
            let mut url = format!("http://localhost:{}", port).parse()?;

            if is_dev {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;

                url = app
                    .config()
                    .build
                    .dev_url
                    .as_ref()
                    .expect("dev_url must be set in tauri.conf.json")
                    .as_str()
                    .parse()?;
            }

            WebviewWindowBuilder::new(app, "main".to_string(), WebviewUrl::External(url))
                .title("Localhost Example")
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
