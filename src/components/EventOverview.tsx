import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Event } from '../types';
import EventCard from './EventCard';
import AddEventModal from './AddEventModal';

interface EventOverviewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
}

const EventOverview: React.FC<EventOverviewProps> = ({ 
  events, 
  onEventSelect, 
  onAddEvent 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by status priority (active first, then upcoming, then completed)
      const statusPriority = { active: 0, upcoming: 1, completed: 2 };
      if (a.status !== b.status) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      // Then sort by start date
      return a.startDate.getTime() - b.startDate.getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Verwaltung von Veranstaltungen und technischen Patchdaten</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neues Event
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Events durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="upcoming">Bevorstehend</option>
            <option value="completed">Abgeschlossen</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Keine Events gefunden</div>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Versuchen Sie andere Suchkriterien' 
              : 'Erstellen Sie Ihr erstes Event'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventSelect(event)}
            />
          ))}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddEvent}
        />
      )}
    </div>
  );
};

export default EventOverview;