import { useState, useEffect } from 'react';
import { Event, PatchData } from '../types';

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'BIOFACH 2025',
    startDate: new Date('2025-02-11'),
    endDate: new Date('2025-02-14'),
    status: 'upcoming',
    location: 'NürnbergMesse',
    halls: ['1', '3', '4', '5', '7', '9'],
    description: 'Weltleitmesse für Bio-Lebensmittel'
  },
  {
    id: '2',
    name: 'embedded world 2025',
    startDate: new Date('2025-03-11'),
    endDate: new Date('2025-03-13'),
    status: 'upcoming',
    location: 'NürnbergMesse',
    halls: ['1', '2', '3', '4', '5'],
    description: 'Fachmesse für embedded-Technologien'
  },
  {
    id: '3',
    name: 'IWA OutdoorClassics 2025',
    startDate: new Date('2025-03-06'),
    endDate: new Date('2025-03-09'),
    status: 'active',
    location: 'NürnbergMesse',
    halls: ['6', '7', '8', '9', '10', '11', '12'],
    description: 'Internationale Fachmesse für Jagd, Schießsport und Outdoor'
  }
];

const mockPatchData: PatchData[] = [
  {
    id: '1',
    eventId: '1',
    hall: '1',
    stand: 'A-101',
    company: 'BioTech Solutions GmbH',
    product: 'Organic Display System',
    dv: 'DV-1-A',
    asw: 'ASW-001',
    port: 'P01',
    cpeEqu: 'CPE-2024-001',
    info: 'Ticket #12345 - Installation geplant',
    status: 'pending',
    priority: 'normal'
  },
  {
    id: '2',
    eventId: '1',
    hall: '1',
    stand: 'A-102',
    company: 'Green Foods International',
    product: 'Interactive Kiosk',
    dv: 'DV-1-A',
    asw: 'ASW-001',
    port: 'P02',
    cpeEqu: 'CPE-2024-002',
    info: 'Dringend - VIP Aussteller',
    status: 'distributed',
    priority: 'high'
  },
  {
    id: '3',
    eventId: '1',
    hall: '3',
    stand: 'C-301',
    company: 'Naturkost Vertrieb',
    product: 'Digital Signage',
    dv: 'DV-3-C',
    asw: 'ASW-003',
    port: 'P15',
    cpeEqu: 'CPE-2024-015',
    info: 'Bereit zur Ausgabe',
    status: 'deployed',
    priority: 'normal'
  }
];

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [patchData, setPatchData] = useState<PatchData[]>(mockPatchData);
  const [loading, setLoading] = useState(false);

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setPatchData(prev => prev.filter(patch => patch.eventId !== id));
  };

  const addPatchData = (patch: Omit<PatchData, 'id'>) => {
    const newPatch: PatchData = {
      ...patch,
      id: Date.now().toString()
    };
    setPatchData(prev => [...prev, newPatch]);
  };

  const updatePatchData = (id: string, updates: Partial<PatchData>) => {
    setPatchData(prev => prev.map(patch => 
      patch.id === id ? { ...patch, ...updates } : patch
    ));
  };

  const deletePatchData = (id: string) => {
    setPatchData(prev => prev.filter(patch => patch.id !== id));
  };

  const duplicatePatchData = (id: string) => {
    const original = patchData.find(patch => patch.id === id);
    if (original) {
      const duplicate: PatchData = {
        ...original,
        id: Date.now().toString(),
        stand: original.stand + '-COPY',
        status: 'pending'
      };
      setPatchData(prev => [...prev, duplicate]);
    }
  };

  const getPatchDataForEvent = (eventId: string) => {
    return patchData.filter(patch => patch.eventId === eventId);
  };

  return {
    events,
    patchData,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    addPatchData,
    updatePatchData,
    deletePatchData,
    duplicatePatchData,
    getPatchDataForEvent
  };
};