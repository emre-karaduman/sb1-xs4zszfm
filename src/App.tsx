import React, { useState } from 'react';
import { Event } from './types';
import { useElectronData } from './hooks/useElectronData';
import Header from './components/Header';
import EventOverview from './components/EventOverview';
import PatchDataTable from './components/PatchDataTable';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const {
    events,
    currentDbPath,
    addEvent,
    updateEvent,
    deleteEvent,
    getPatchDataForEvent,
    addPatchData,
    updatePatchData,
    deletePatchData,
    duplicatePatchData,
    createNewDatabase,
    openDatabase,
    exportEvent,
    importEvent,
    exportAllEvents
  } = useElectronData();

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBackToOverview = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentDbPath={currentDbPath} />
      
      <main className="container mx-auto px-6 py-8">
        {selectedEvent ? (
          <PatchDataTable
            event={selectedEvent}
            onBack={handleBackToOverview}
            onAddPatchData={addPatchData}
            onUpdatePatchData={updatePatchData}
            onDeletePatchData={deletePatchData}
            onDuplicatePatchData={duplicatePatchData}
            getPatchData={getPatchDataForEvent}
          />
        ) : (
          <EventOverview
            events={events}
            currentDbPath={currentDbPath}
            onEventSelect={handleEventSelect}
            onAddEvent={addEvent}
            onCreateNewDatabase={createNewDatabase}
            onOpenDatabase={openDatabase}
            onExportAll={exportAllEvents}
            onImport={importEvent}
            onExportEvent={exportEvent}
          />
        )}
      </main>
    </div>
  );
}

export default App;