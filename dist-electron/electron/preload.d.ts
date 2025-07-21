declare const electronAPI: {
    getEvents: () => Promise<any>;
    addEvent: (event: any) => Promise<any>;
    updateEvent: (id: string, updates: any) => Promise<any>;
    deleteEvent: (id: string) => Promise<any>;
    getPatchData: (eventId: string) => Promise<any>;
    addPatchData: (patch: any) => Promise<any>;
    updatePatchData: (id: string, updates: any) => Promise<any>;
    deletePatchData: (id: string) => Promise<any>;
    duplicatePatchData: (id: string) => Promise<any>;
    createNewDatabase: () => Promise<any>;
    openDatabase: () => Promise<any>;
    getCurrentDatabasePath: () => Promise<any>;
    exportEvent: (eventId: string) => Promise<any>;
    importEvent: () => Promise<any>;
    exportAllEvents: () => Promise<any>;
};
export type ElectronAPI = typeof electronAPI;
export {};
//# sourceMappingURL=preload.d.ts.map