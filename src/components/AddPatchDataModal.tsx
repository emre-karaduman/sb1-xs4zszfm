import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PatchData } from '../types';

interface AddPatchDataModalProps {
  eventId: string;
  onClose: () => void;
  onAdd: (patch: Omit<PatchData, 'id'>) => void;
}

const AddPatchDataModal: React.FC<AddPatchDataModalProps> = ({ 
  eventId, 
  onClose, 
  onAdd 
}) => {
  const [formData, setFormData] = useState({
    hall: '',
    stand: '',
    company: '',
    product: '',
    dv: '',
    asw: '',
    port: '',
    cpeEqu: '',
    info: '',
    status: 'pending' as PatchData['status'],
    priority: 'normal' as PatchData['priority']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatch: Omit<PatchData, 'id'> = {
      ...formData,
      eventId
    };

    onAdd(newPatch);
    onClose();
  };

  const isFormValid = formData.hall && formData.stand && formData.company;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Neuen Stand hinzufügen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Halle *
              </label>
              <input
                type="text"
                value={formData.hall}
                onChange={(e) => setFormData(prev => ({ ...prev, hall: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="z.B. 1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stand *
              </label>
              <input
                type="text"
                value={formData.stand}
                onChange={(e) => setFormData(prev => ({ ...prev, stand: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="z.B. A-101"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Firma *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Firmenname"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produkt
            </label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) => setFormData(prev => ({ ...prev, product: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Produktbeschreibung"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DV
              </label>
              <input
                type="text"
                value={formData.dv}
                onChange={(e) => setFormData(prev => ({ ...prev, dv: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="DV-1-A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ASW
              </label>
              <input
                type="text"
                value={formData.asw}
                onChange={(e) => setFormData(prev => ({ ...prev, asw: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="ASW-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Port
              </label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="P01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPE / EQU
            </label>
            <input
              type="text"
              value={formData.cpeEqu}
              onChange={(e) => setFormData(prev => ({ ...prev, cpeEqu: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="CPE-2024-001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PatchData['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="pending">Im DV</option>
                <option value="distributed">Ausgeteilt</option>
                <option value="deployed">Am Stand</option>
                <option value="returned">Zurückgegeben</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorität
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as PatchData['priority'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="high">Hoch</option>
                <option value="urgent">Dringend</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Info / Kommentare
            </label>
            <textarea
              value={formData.info}
              onChange={(e) => setFormData(prev => ({ ...prev, info: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Zusätzliche Informationen, Ticketnummern, etc."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Stand hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatchDataModal;