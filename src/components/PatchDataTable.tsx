import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Filter, 
  Search, 
  Edit3, 
  Copy, 
  Trash2,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';
import { Event, PatchData, FilterOptions } from '../types';
import AddPatchDataModal from './AddPatchDataModal';
import EditPatchDataModal from './EditPatchDataModal';

interface PatchDataTableProps {
  event: Event;
  patchData: PatchData[];
  onBack: () => void;
  onAddPatchData: (patch: Omit<PatchData, 'id'>) => void;
  onUpdatePatchData: (id: string, updates: Partial<PatchData>) => void;
  onDeletePatchData: (id: string) => void;
  onDuplicatePatchData: (id: string) => void;
}

const PatchDataTable: React.FC<PatchDataTableProps> = ({
  event,
  patchData,
  onBack,
  onAddPatchData,
  onUpdatePatchData,
  onDeletePatchData,
  onDuplicatePatchData
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatch, setEditingPatch] = useState<PatchData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  const getStatusIcon = (status: PatchData['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'distributed':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'deployed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'returned':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: PatchData['status']) => {
    switch (status) {
      case 'pending':
        return 'Im DV';
      case 'distributed':
        return 'Ausgeteilt';
      case 'deployed':
        return 'Am Stand';
      case 'returned':
        return 'Zurückgegeben';
      default:
        return 'Unbekannt';
    }
  };

  const getPriorityColor = (priority: PatchData['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-200';
      case 'high':
        return 'bg-yellow-100 border-yellow-200';
      default:
        return '';
    }
  };

  const filteredPatchData = patchData.filter(patch => {
    const matchesSearch = 
      patch.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patch.stand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patch.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patch.hall.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHall = !filters.hall || patch.hall === filters.hall;
    const matchesStatus = !filters.status || patch.status === filters.status;
    const matchesPriority = !filters.priority || patch.priority === filters.priority;
    const matchesCompany = !filters.company || patch.company.toLowerCase().includes(filters.company.toLowerCase());

    return matchesSearch && matchesHall && matchesStatus && matchesPriority && matchesCompany;
  });

  const uniqueHalls = [...new Set(patchData.map(p => p.hall))].sort();
  const uniqueCompanies = [...new Set(patchData.map(p => p.company))].sort();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // In a real application, you would upload this to a server
      console.log('Uploading hall plan:', file.name);
      // For demo purposes, we'll just log it
      alert(`Hallenplan "${file.name}" wurde hochgeladen.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="text-gray-600">Patchdaten-Verwaltung</p>
          </div>
        </div>
        <div className="flex gap-2">
          <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Hallenplan
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neuer Stand
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filters.hall || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, hall: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Alle Hallen</option>
            {uniqueHalls.map(hall => (
              <option key={hall} value={hall}>Halle {hall}</option>
            ))}
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Alle Status</option>
            <option value="pending">Im DV</option>
            <option value="distributed">Ausgeteilt</option>
            <option value="deployed">Am Stand</option>
            <option value="returned">Zurückgegeben</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Alle Prioritäten</option>
            <option value="normal">Normal</option>
            <option value="high">Hoch</option>
            <option value="urgent">Dringend</option>
          </select>

          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Halle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produkt</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DV</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASW</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPE/EQU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatchData.map((patch) => (
                <tr 
                  key={patch.id} 
                  className={`hover:bg-gray-50 ${getPriorityColor(patch.priority)}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patch.hall}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patch.stand}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {patch.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {patch.product}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patch.dv}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patch.asw}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patch.port}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patch.cpeEqu}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(patch.status)}
                      <span className="text-sm text-gray-900">
                        {getStatusText(patch.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {patch.info}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingPatch(patch)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicatePatchData(patch.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Duplizieren"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePatchData(patch.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatchData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Keine Patchdaten gefunden</div>
            <p className="text-gray-500">
              {searchTerm || Object.keys(filters).length > 0
                ? 'Versuchen Sie andere Suchkriterien'
                : 'Fügen Sie den ersten Stand hinzu'}
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{patchData.length}</div>
          <div className="text-sm text-gray-600">Gesamt Stände</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {patchData.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Im DV</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {patchData.filter(p => p.status === 'deployed').length}
          </div>
          <div className="text-sm text-gray-600">Am Stand</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {patchData.filter(p => p.status === 'returned').length}
          </div>
          <div className="text-sm text-gray-600">Zurückgegeben</div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPatchDataModal
          eventId={event.id}
          onClose={() => setShowAddModal(false)}
          onAdd={onAddPatchData}
        />
      )}

      {editingPatch && (
        <EditPatchDataModal
          patch={editingPatch}
          onClose={() => setEditingPatch(null)}
          onUpdate={onUpdatePatchData}
        />
      )}
    </div>
  );
};

export default PatchDataTable;