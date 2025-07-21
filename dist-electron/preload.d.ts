declare const electronAPI: {
    getEvents: () => any;
    addEvent: (event: any) => any;
    updateEvent: (id: string, updates: any) => any;
    deleteEvent: (id: string) => any;
    getPatchData: (eventId: string) => any;
    addPatchData: (patch: any) => any;
    updatePatchData: (id: string, updates: any) => any;
    deletePatchData: (id: string) => any;
    duplicatePatchData: (id: string) => any;
    createNewDatabase: () => any;
    openDatabase: () => any;
    getCurrentDatabasePath: () => any;
    exportEvent: (eventId: string) => any;
    importEvent: () => any;
    exportAllEvents: () => any;
};
export type ElectronAPI = typeof electronAPI;
export {};
//# sourceMappingURL=preload.d.ts.map