"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
let mainWindow;
let db;
const isDev = process.env.NODE_ENV === 'development';
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, '../public/logo_servicepartner_messe.png'),
        title: 'NürnbergMesse Event Management System'
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}
function initDatabase(dbPath) {
    const defaultPath = path.join(electron_1.app.getPath('userData'), 'events.db');
    const finalPath = dbPath || defaultPath;
    if (db) {
        db.close();
    }
    db = new better_sqlite3_1.default(finalPath);
    // Create tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      status TEXT NOT NULL,
      location TEXT NOT NULL,
      halls TEXT NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patch_data (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      hall TEXT NOT NULL,
      stand TEXT NOT NULL,
      company TEXT NOT NULL,
      product TEXT,
      dv TEXT,
      asw TEXT,
      port TEXT,
      cpeEqu TEXT,
      info TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'normal',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events (id) ON DELETE CASCADE
    );
  `);
    return finalPath;
}
electron_1.app.whenReady().then(() => {
    createWindow();
    initDatabase();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (db)
            db.close();
        electron_1.app.quit();
    }
});
// IPC Handlers
electron_1.ipcMain.handle('get-events', () => {
    const stmt = db.prepare('SELECT * FROM events ORDER BY startDate');
    const events = stmt.all().map(event => ({
        ...event,
        halls: JSON.parse(event.halls),
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
    }));
    return events;
});
electron_1.ipcMain.handle('add-event', (_, event) => {
    const id = Date.now().toString();
    const stmt = db.prepare(`
    INSERT INTO events (id, name, startDate, endDate, status, location, halls, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(id, event.name, event.startDate.toISOString(), event.endDate.toISOString(), event.status, event.location, JSON.stringify(event.halls), event.description);
    return { ...event, id };
});
electron_1.ipcMain.handle('update-event', (_, id, updates) => {
    const fields = [];
    const values = [];
    Object.entries(updates).forEach(([key, value]) => {
        if (key === 'halls') {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(value));
        }
        else if (key === 'startDate' || key === 'endDate') {
            fields.push(`${key} = ?`);
            values.push(value.toISOString());
        }
        else {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    });
    values.push(id);
    const stmt = db.prepare(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return true;
});
electron_1.ipcMain.handle('delete-event', (_, id) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(id);
    return true;
});
electron_1.ipcMain.handle('get-patch-data', (_, eventId) => {
    const stmt = db.prepare('SELECT * FROM patch_data WHERE eventId = ? ORDER BY hall, stand');
    return stmt.all(eventId);
});
electron_1.ipcMain.handle('add-patch-data', (_, patch) => {
    const id = Date.now().toString();
    const stmt = db.prepare(`
    INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
    stmt.run(id, patch.eventId, patch.hall, patch.stand, patch.company, patch.product, patch.dv, patch.asw, patch.port, patch.cpeEqu, patch.info, patch.status, patch.priority);
    return { ...patch, id };
});
electron_1.ipcMain.handle('update-patch-data', (_, id, updates) => {
    const fields = [];
    const values = [];
    Object.entries(updates).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
    });
    values.push(id);
    const stmt = db.prepare(`UPDATE patch_data SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return true;
});
electron_1.ipcMain.handle('delete-patch-data', (_, id) => {
    const stmt = db.prepare('DELETE FROM patch_data WHERE id = ?');
    stmt.run(id);
    return true;
});
electron_1.ipcMain.handle('duplicate-patch-data', (_, id) => {
    const original = db.prepare('SELECT * FROM patch_data WHERE id = ?').get(id);
    if (original) {
        const newId = Date.now().toString();
        const stmt = db.prepare(`
      INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(newId, original.eventId, original.hall, original.stand + '-COPY', original.company, original.product, original.dv, original.asw, original.port, original.cpeEqu, original.info, 'pending', original.priority);
        return { ...original, id: newId, stand: original.stand + '-COPY', status: 'pending' };
    }
    return null;
});
// Database Management
electron_1.ipcMain.handle('create-new-database', async () => {
    const result = await electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Neue Datenbank erstellen',
        defaultPath: 'events.db',
        filters: [
            { name: 'SQLite Database', extensions: ['db'] }
        ]
    });
    if (!result.canceled && result.filePath) {
        const newPath = initDatabase(result.filePath);
        return { success: true, path: newPath };
    }
    return { success: false };
});
electron_1.ipcMain.handle('open-database', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        title: 'Datenbank öffnen',
        filters: [
            { name: 'SQLite Database', extensions: ['db'] }
        ],
        properties: ['openFile']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        const newPath = initDatabase(result.filePaths[0]);
        return { success: true, path: newPath };
    }
    return { success: false };
});
electron_1.ipcMain.handle('get-current-database-path', () => {
    return db ? db.name : null;
});
// Export/Import
electron_1.ipcMain.handle('export-event', async (_, eventId) => {
    const result = await electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Event exportieren',
        defaultPath: `event-${eventId}.json`,
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ]
    });
    if (!result.canceled && result.filePath) {
        const event = db.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
        const patchData = db.prepare('SELECT * FROM patch_data WHERE eventId = ?').all(eventId);
        const exportData = {
            event: {
                ...event,
                halls: JSON.parse(event.halls)
            },
            patchData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2));
        return { success: true, path: result.filePath };
    }
    return { success: false };
});
electron_1.ipcMain.handle('import-event', async () => {
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        title: 'Event importieren',
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ],
        properties: ['openFile']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        try {
            const data = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
            // Import event
            const newEventId = Date.now().toString();
            const eventStmt = db.prepare(`
        INSERT INTO events (id, name, startDate, endDate, status, location, halls, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
            eventStmt.run(newEventId, data.event.name + ' (Importiert)', data.event.startDate, data.event.endDate, data.event.status, data.event.location, JSON.stringify(data.event.halls), data.event.description);
            // Import patch data
            const patchStmt = db.prepare(`
        INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            data.patchData.forEach((patch, index) => {
                patchStmt.run((Date.now() + index).toString(), newEventId, patch.hall, patch.stand, patch.company, patch.product, patch.dv, patch.asw, patch.port, patch.cpeEqu, patch.info, patch.status, patch.priority);
            });
            return { success: true, eventId: newEventId };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    return { success: false };
});
electron_1.ipcMain.handle('export-all-events', async () => {
    const result = await electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Alle Events exportieren',
        defaultPath: `all-events-${new Date().toISOString().split('T')[0]}.json`,
        filters: [
            { name: 'JSON Files', extensions: ['json'] }
        ]
    });
    if (!result.canceled && result.filePath) {
        const events = db.prepare('SELECT * FROM events').all();
        const allData = events.map(event => {
            const patchData = db.prepare('SELECT * FROM patch_data WHERE eventId = ?').all(event.id);
            return {
                event: {
                    ...event,
                    halls: JSON.parse(event.halls)
                },
                patchData
            };
        });
        const exportData = {
            events: allData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2));
        return { success: true, path: result.filePath };
    }
    return { success: false };
});
//# sourceMappingURL=main.js.map