import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  // Events
  getEvents: () => ipcRenderer.invoke('get-events'),
  addEvent: (event: any) => ipcRenderer.invoke('add-event', event),
  updateEvent: (id: string, updates: any) => ipcRenderer.invoke('update-event', id, updates),
  deleteEvent: (id: string) => ipcRenderer.invoke('delete-event', id),
  
  // Patch Data
  getPatchData: (eventId: string) => ipcRenderer.invoke('get-patch-data', eventId),
  addPatchData: (patch: any) => ipcRenderer.invoke('add-patch-data', patch),
  updatePatchData: (id: string, updates: any) => ipcRenderer.invoke('update-patch-data', id, updates),
  deletePatchData: (id: string) => ipcRenderer.invoke('delete-patch-data', id),
  duplicatePatchData: (id: string) => ipcRenderer.invoke('duplicate-patch-data', id),
  
  // Database Management
  createNewDatabase: () => ipcRenderer.invoke('create-new-database'),
  openDatabase: () => ipcRenderer.invoke('open-database'),
  getCurrentDatabasePath: () => ipcRenderer.invoke('get-current-database-path'),
  
  // Export/Import
  exportEvent: (eventId: string) => ipcRenderer.invoke('export-event', eventId),
  importEvent: () => ipcRenderer.invoke('import-event'),
  exportAllEvents: () => ipcRenderer.invoke('export-all-events')
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;