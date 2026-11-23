// KMCero ERP 0.1.0 - 2026-11-23
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const schema=readFileSync(new URL('../src-tauri/migrations/001_core.sql',import.meta.url),'utf8');
test('schema has critical entities',()=>{for(const name of ['tank','fuel_lot','fuel_movement','sale','daily_close','audit_event'])assert.match(schema,new RegExp('CREATE TABLE IF NOT EXISTS '+name+'\\('))});
test('variant set is explicit',()=>assert.match(schema,/variant IN \('V1','V2','V3','V4','V5'\)/));
test('all movements keep operator and document',()=>{assert.match(schema,/source_reference TEXT NOT NULL/);assert.match(schema,/operator_id TEXT NOT NULL/)});
