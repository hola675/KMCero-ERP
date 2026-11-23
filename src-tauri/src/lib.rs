// KMCero ERP 0.1.0 - 2026-11-23
// Prototipo: solo consultas locales. Las operaciones reales requieren autenticación y transacciones auditadas.
use rusqlite::Connection;
use serde::Serialize;
use std::{fs, path::PathBuf};
use tauri::Manager;

#[derive(Serialize)]
struct Overview { stations: i64, tanks: i64, products: i64, recorded_movements: i64 }

fn db_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&base).map_err(|e| e.to_string())?;
    Ok(base.join("kmcero.sqlite3"))
}
fn open_db(app: &tauri::AppHandle) -> Result<Connection,String> {
    let mut db = Connection::open(db_path(app)?).map_err(|e|e.to_string())?;
    db.execute_batch("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;").map_err(|e|e.to_string())?;
    db.execute_batch("BEGIN IMMEDIATE;").map_err(|e| e.to_string())?;
    if let Err(e) = db.execute_batch(include_str!("../migrations/001_core.sql")) {
        let _=db.execute_batch("ROLLBACK;"); return Err(e.to_string());
    }
    db.execute_batch("COMMIT;").map_err(|e|e.to_string())?;
    Ok(db)
}
#[tauri::command]
fn overview(app: tauri::AppHandle) -> Result<Overview,String> {
    let db=open_db(&app)?;
    let count=|name: &str| -> Result<i64,String> {
        db.query_row(&format!("SELECT COUNT(*) FROM {name}"),[],|r|r.get(0)).map_err(|e|e.to_string())
    };
    Ok(Overview{stations:count("station")?,tanks:count("tank")?,products:count("fuel_product")?,recorded_movements:count("fuel_movement")?})
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default().invoke_handler(tauri::generate_handler![overview])
        .run(tauri::generate_context!()).expect("error launching KMCero ERP");
}
