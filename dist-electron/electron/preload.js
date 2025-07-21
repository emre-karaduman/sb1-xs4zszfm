"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronAPI = {
    // Events
    getEvents: () => electron_1.ipcRenderer.invoke('get-events'),
    addEvent: (event) => electron_1.ipcRenderer.invoke('add-event', event),
    updateEvent: (id, updates) => electron_1.ipcRenderer.invoke('update-event', id, updates),
    deleteEvent: (id) => electron_1.ipcRenderer.invoke('delete-event', id),
    // Patch Data
    getPatchData: (eventId) => electron_1.ipcRenderer.invoke('get-patch-data', eventId),
    addPatchData: (patch) => electron_1.ipcRenderer.invoke('add-patch-data', patch),
    updatePatchData: (id, updates) => electron_1.ipcRenderer.invoke('update-patch-data', id, updates),
    deletePatchData: (id) => electron_1.ipcRenderer.invoke('delete-patch-data', id),
    duplicatePatchData: (id) => electron_1.ipcRenderer.invoke('duplicate-patch-data', id),
    // Database Management
    createNewDatabase: () => electron_1.ipcRenderer.invoke('create-new-database'),
    openDatabase: () => electron_1.ipcRenderer.invoke('open-database'),
    getCurrentDatabasePath: () => electron_1.ipcRenderer.invoke('get-current-database-path'),
    // Export/Import
    exportEvent: (eventId) => electron_1.ipcRenderer.invoke('export-event', eventId),
    importEvent: () => electron_1.ipcRenderer.invoke('import-event'),
    exportAllEvents: () => electron_1.ipcRenderer.invoke('export-all-events')
};
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
//# sourceMappingURL=preload.js.map