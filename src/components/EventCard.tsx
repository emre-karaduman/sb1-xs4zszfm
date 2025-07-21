import React from 'react';
import { Calendar, MapPin, Users, Clock, Download } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onExport: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onExport }) => {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'upcoming':
        return 'Bevorstehend';
      case 'completed':
        return 'Abgeschlossen';
      default:
        return 'Unbekannt';
    }
  };

  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return `${start.toLocaleDateString('de-DE', options)} - ${end.toLocaleDateString('de-DE', options)}`;
  };

  const getDaysUntilEvent = (startDate: Date) => {
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilEvent(event.startDate);

  const handleExportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExport();
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-200 group relative"
    >
      {/* Export Button */}
      <button
        onClick={handleExportClick}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Event exportieren"
      >
        <Download className="w-4 h-4" />
      </button>

      <div className="flex justify-between items-start mb-4 pr-8">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {event.name}
          </h3>
          {event.description && (
            <p className="text-gray-600 text-sm mt-1">{event.description}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
          {getStatusText(event.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-3 text-orange-500" />
          <span className="text-sm">{formatDateRange(event.startDate, event.endDate)}</span>
          {event.status === 'upcoming' && daysUntil > 0 && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
              in {daysUntil} Tagen
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-3 text-orange-500" />
          <span className="text-sm">{event.location}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-3 text-orange-500" />
          <span className="text-sm">Hallen: {event.halls.join(', ')}</span>
        </div>

        {event.status === 'active' && (
          <div className="flex items-center text-green-600">
            <Clock className="w-4 h-4 mr-3" />
            <span className="text-sm font-medium">Läuft gerade</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;