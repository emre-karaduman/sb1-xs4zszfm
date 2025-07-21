import { useState, useEffect } from 'react';
import { Event, PatchData } from '../types';

export const useElectronData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDbPath, setCurrentDbPath] = useState<string>('');

  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await window.electronAPI.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentDbPath = async () => {
    try {
      const path = await window.electronAPI.getCurrentDatabasePath();
      setCurrentDbPath(path || '');
    } catch (error) {
      console.error('Error getting database path:', error);
    }
  };

  useEffect(() => {
    loadEvents();
    loadCurrentDbPath();
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const newEvent = await window.electronAPI.addEvent(event);
      await loadEvents();
      return newEvent;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await window.electronAPI.updateEvent(id, updates);
      await loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await window.electronAPI.deleteEvent(id);
      await loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const getPatchDataForEvent = async (eventId: string): Promise<PatchData[]> => {
    try {
      return await window.electronAPI.getPatchData(eventId);
    } catch (error) {
      console.error('Error loading patch data:', error);
      return [];
    }
  };

  const addPatchData = async (patch: Omit<PatchData, 'id'>) => {
    try {
      return await window.electronAPI.addPatchData(patch);
    } catch (error) {
      console.error('Error adding patch data:', error);
      throw error;
    }
  };

  const updatePatchData = async (id: string, updates: Partial<PatchData>) => {
    try {
      await window.electronAPI.updatePatchData(id, updates);
    } catch (error) {
      console.error('Error updating patch data:', error);
      throw error;
    }
  };

  const deletePatchData = async (id: string) => {
    try {
      await window.electronAPI.deletePatchData(id);
    } catch (error) {
      console.error('Error deleting patch data:', error);
      throw error;
    }
  };

  const duplicatePatchData = async (id: string) => {
    try {
      return await window.electronAPI.duplicatePatchData(id);
    } catch (error) {
      console.error('Error duplicating patch data:', error);
      throw error;
    }
  };

  // Database Management
  const createNewDatabase = async () => {
    try {
      const result = await window.electronAPI.createNewDatabase();
      if (result.success) {
        await loadEvents();
        await loadCurrentDbPath();
      }
      return result;
    } catch (error) {
      console.error('Error creating new database:', error);
      throw error;
    }
  };

  const openDatabase = async () => {
    try {
      const result = await window.electronAPI.openDatabase();
      if (result.success) {
        await loadEvents();
        await loadCurrentDbPath();
      }
      return result;
    } catch (error) {
      console.error('Error opening database:', error);
      throw error;
    }
  };

  // Export/Import
  const exportEvent = async (eventId: string) => {
    try {
      return await window.electronAPI.exportEvent(eventId);
    } catch (error) {
      console.error('Error exporting event:', error);
      throw error;
    }
  };

  const importEvent = async () => {
    try {
      const result = await window.electronAPI.importEvent();
      if (result.success) {
        await loadEvents();
      }
      return result;
    } catch (error) {
      console.error('Error importing event:', error);
      throw error;
    }
  };

  const exportAllEvents = async () => {
    try {
      return await window.electronAPI.exportAllEvents();
    } catch (error) {
      console.error('Error exporting all events:', error);
      throw error;
    }
  };

  return {
    events,
    loading,
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
    exportAllEvents,
    refreshEvents: loadEvents
  };
};