import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import Database from 'better-sqlite3';
import * as fs from 'fs';

interface RawEventFromDB {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  halls: string;
  description: string;
  createdAt: string;
}

let mainWindow: BrowserWindow;
let db: Database.Database;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
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
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function initDatabase(dbPath?: string) {
  const defaultPath = path.join(app.getPath('userData'), 'events.db');
  const finalPath = dbPath || defaultPath;
  
  if (db) {
    db.close();
  }
  
  db = new Database(finalPath);
  
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

app.whenReady().then(() => {
  createWindow();
  initDatabase();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-events', (_: Electron.IpcMainInvokeEvent) => {
  const stmt = db.prepare('SELECT * FROM events ORDER BY startDate');
  const events = stmt.all().map((event: RawEventFromDB) => ({
    ...event,
    halls: JSON.parse(event.halls),
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate)
  }));
  return events;
});

ipcMain.handle('add-event', (_: Electron.IpcMainInvokeEvent, event: any) => {
  const id = Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO events (id, name, startDate, endDate, status, location, halls, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    event.name,
    event.startDate.toISOString(),
    event.endDate.toISOString(),
    event.status,
    event.location,
    JSON.stringify(event.halls),
    event.description
  );
  
  return { ...event, id };
});

ipcMain.handle('update-event', (_: Electron.IpcMainInvokeEvent, id: string, updates: Partial<any>) => {
  const fields: string[] = [];
  const values: any[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'halls') {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(value));
    } else if (key === 'startDate' || key === 'endDate') {
      fields.push(`${key} = ?`);
      values.push((value as Date).toISOString());
    } else {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });
  
  values.push(id);
  
  const stmt = db.prepare(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return true;
});

ipcMain.handle('delete-event', (_: Electron.IpcMainInvokeEvent, id: string) => {
  const stmt = db.prepare('DELETE FROM events WHERE id = ?');
  stmt.run(id);
  return true;
});

ipcMain.handle('get-patch-data', (_: Electron.IpcMainInvokeEvent, eventId: string) => {
  const stmt = db.prepare('SELECT * FROM patch_data WHERE eventId = ? ORDER BY hall, stand');
  return stmt.all(eventId);
});

ipcMain.handle('add-patch-data', (_: Electron.IpcMainInvokeEvent, patch: any) => {
  const id = Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    patch.eventId,
    patch.hall,
    patch.stand,
    patch.company,
    patch.product,
    patch.dv,
    patch.asw,
    patch.port,
    patch.cpeEqu,
    patch.info,
    patch.status,
    patch.priority
  );
  
  return { ...patch, id };
});

ipcMain.handle('update-patch-data', (_: Electron.IpcMainInvokeEvent, id: string, updates: Partial<any>) => {
  const fields: string[] = [];
  const values: any[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });
  
  values.push(id);
  
  const stmt = db.prepare(`UPDATE patch_data SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
  
  return true;
});

ipcMain.handle('delete-patch-data', (_: Electron.IpcMainInvokeEvent, id: string) => {
  const stmt = db.prepare('DELETE FROM patch_data WHERE id = ?');
  stmt.run(id);
  return true;
});

ipcMain.handle('duplicate-patch-data', (_: Electron.IpcMainInvokeEvent, id: string) => {
  const original = db.prepare('SELECT * FROM patch_data WHERE id = ?').get(id);
  if (original) {
    const newId = Date.now().toString();
    const stmt = db.prepare(`
      INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      newId,
      original.eventId,
      original.hall,
      original.stand + '-COPY',
      original.company,
      original.product,
      original.dv,
      original.asw,
      original.port,
      original.cpeEqu,
      original.info,
      'pending',
      original.priority
    );
    
    return { ...original, id: newId, stand: original.stand + '-COPY', status: 'pending' };
  }
  return null;
});

// Database Management
ipcMain.handle('create-new-database', async (_: Electron.IpcMainInvokeEvent) => {
  const result = await dialog.showSaveDialog(mainWindow, {
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

ipcMain.handle('open-database', async (_: Electron.IpcMainInvokeEvent) => {
  const result = await dialog.showOpenDialog(mainWindow, {
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

ipcMain.handle('get-current-database-path', (_: Electron.IpcMainInvokeEvent) => {
  return db ? db.name : null;
});

// Export/Import
ipcMain.handle('export-event', async (_: Electron.IpcMainInvokeEvent, eventId: string) => {
  const result = await dialog.showSaveDialog(mainWindow, {
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

ipcMain.handle('import-event', async (_: Electron.IpcMainInvokeEvent) => {
  const result = await dialog.showOpenDialog(mainWindow, {
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
      
      eventStmt.run(
        newEventId,
        data.event.name + ' (Importiert)',
        data.event.startDate,
        data.event.endDate,
        data.event.status,
        data.event.location,
        JSON.stringify(data.event.halls),
        data.event.description
      );
      
      // Import patch data
      const patchStmt = db.prepare(`
        INSERT INTO patch_data (id, eventId, hall, stand, company, product, dv, asw, port, cpeEqu, info, status, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      data.patchData.forEach((patch: any, index: number) => {
        patchStmt.run(
          (Date.now() + index).toString(),
          newEventId,
          patch.hall,
          patch.stand,
          patch.company,
          patch.product,
          patch.dv,
          patch.asw,
          patch.port,
          patch.cpeEqu,
          patch.info,
          patch.status,
          patch.priority
        );
      });
      
      return { success: true, eventId: newEventId };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: String(error) };
    }
  }
  
  return { success: false };
});

ipcMain.handle('export-all-events', async (_: Electron.IpcMainInvokeEvent) => {
  const result = await dialog.showSaveDialog(mainWindow, {
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