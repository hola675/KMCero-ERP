-- KMCero ERP - schema 0.1.0 (2026-11-23)
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS station(id TEXT PRIMARY KEY,name TEXT NOT NULL, code TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS fuel_product(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE, unit TEXT NOT NULL DEFAULT 'L');
CREATE TABLE IF NOT EXISTS tank(id TEXT PRIMARY KEY,station_id TEXT NOT NULL REFERENCES station(id),product_id TEXT NOT NULL REFERENCES fuel_product(id),name TEXT NOT NULL,capacity_ml INTEGER NOT NULL CHECK(capacity_ml > 0),UNIQUE(station_id,name));
CREATE TABLE IF NOT EXISTS client(id TEXT PRIMARY KEY,name TEXT NOT NULL,identifier TEXT);
CREATE TABLE IF NOT EXISTS fuel_lot(id TEXT PRIMARY KEY,product_id TEXT NOT NULL REFERENCES fuel_product(id),owner_type TEXT NOT NULL CHECK(owner_type IN ('ENCC','CLIENT')),
client_id TEXT REFERENCES client(id),receipt_reference TEXT,received_at TEXT NOT NULL, CHECK((owner_type='ENCC' AND client_id IS NULL) OR (owner_type='CLIENT' AND client_id IS NOT NULL)));
CREATE TABLE IF NOT EXISTS fuel_movement(
 id TEXT PRIMARY KEY,station_id TEXT NOT NULL REFERENCES station(id),tank_id TEXT NOT NULL REFERENCES tank(id),lot_id TEXT NOT NULL REFERENCES fuel_lot(id),
 movement_type TEXT NOT NULL CHECK(movement_type IN ('RECEIPT','SALE','TRANSFER_IN','TRANSFER_OUT','ADJUSTMENT')),
 volume_ml INTEGER NOT NULL CHECK(volume_ml != 0),effective_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 source_reference TEXT NOT NULL, operator_id TEXT NOT NULL, reason TEXT, reversal_of TEXT UNIQUE REFERENCES fuel_movement(id),
 CHECK ((movement_type IN ('RECEIPT','TRANSFER_IN','SALE','TRANSFER_OUT') AND volume_ml > 0) OR movement_type='ADJUSTMENT')
);
CREATE TABLE IF NOT EXISTS sale(
 id TEXT PRIMARY KEY,station_id TEXT NOT NULL REFERENCES station(id),movement_id TEXT NOT NULL UNIQUE REFERENCES fuel_movement(id),
 variant TEXT NOT NULL CHECK(variant IN ('V1','V2','V3','V4','V5')),client_id TEXT REFERENCES client(id),
 receipt_reference TEXT NOT NULL UNIQUE, payment_reference TEXT, payment_verified INTEGER NOT NULL DEFAULT 0 CHECK(payment_verified IN (0,1)),
 sale_at TEXT NOT NULL, CHECK(variant != 'V1' OR client_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS tank_measurement(id TEXT PRIMARY KEY,tank_id TEXT NOT NULL REFERENCES tank(id),measured_at TEXT NOT NULL,
 total_level_mm INTEGER NOT NULL CHECK(total_level_mm >= 0),water_level_mm INTEGER NOT NULL CHECK(water_level_mm >= 0),
 observed_volume_ml INTEGER CHECK(observed_volume_ml >= 0),operator_id TEXT NOT NULL, CHECK(water_level_mm <= total_level_mm));
CREATE TABLE IF NOT EXISTS daily_close(id TEXT PRIMARY KEY,station_id TEXT NOT NULL REFERENCES station(id),local_day TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT','APPROVED')),approved_at TEXT,approved_by TEXT,UNIQUE(station_id,local_day));
CREATE TABLE IF NOT EXISTS audit_event(id TEXT PRIMARY KEY,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,actor_id TEXT NOT NULL,entity TEXT NOT NULL,
 entity_id TEXT NOT NULL,action TEXT NOT NULL,previous_hash TEXT,record_hash TEXT NOT NULL,details TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_movement_station_date ON fuel_movement(station_id,effective_at);
CREATE INDEX IF NOT EXISTS idx_movement_lot ON fuel_movement(lot_id);
CREATE VIEW IF NOT EXISTS v_lot_balance AS SELECT lot_id,tank_id,
 SUM(CASE WHEN movement_type IN ('RECEIPT','TRANSFER_IN') THEN volume_ml WHEN movement_type IN ('SALE','TRANSFER_OUT') THEN -volume_ml ELSE volume_ml END) AS balance_ml
 FROM fuel_movement GROUP BY lot_id,tank_id;
