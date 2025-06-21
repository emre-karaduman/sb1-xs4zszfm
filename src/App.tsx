import React, { useState } from 'react';
import { Event } from './types';
import { useEvents } from './hooks/useEvents';
import Header from './components/Header';
import EventOverview from './components/EventOverview';
import PatchDataTable from './components/PatchDataTable';

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    addPatchData,
    updatePatchData,
    deletePatchData,
    duplicatePatchData,
    getPatchDataForEvent
  } = useEvents();

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleBackToOverview = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {selectedEvent ? (
          <PatchDataTable
            event={selectedEvent}
            patchData={getPatchDataForEvent(selectedEvent.id)}
            onBack={handleBackToOverview}
            onAddPatchData={addPatchData}
            onUpdatePatchData={updatePatchData}
            onDeletePatchData={deletePatchData}
            onDuplicatePatchData={duplicatePatchData}
          />
        ) : (
          <EventOverview
            events={events}
            onEventSelect={handleEventSelect}
            onAddEvent={addEvent}
          />
        )}
      </main>
    </div>
  );
}

export default App;