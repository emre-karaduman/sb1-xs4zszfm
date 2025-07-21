import React, { useState } from 'react';
import { Database, FolderOpen, Plus, Download, Upload, Trash2 } from 'lucide-react';

interface DatabaseManagerProps {
  currentDbPath: string;
  onCreateNew: () => Promise<any>;
  onOpen: () => Promise<any>;
  onExportAll: () => Promise<any>;
  onImport: () => Promise<any>;
}

const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  currentDbPath,
  onCreateNew,
  onOpen,
  onExportAll,
  onImport
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNew = async () => {
    setIsLoading(true);
    try {
      const result = await onCreateNew();
      if (result.success) {
        alert('Neue Datenbank wurde erfolgreich erstellt!');
      }
    } catch (error) {
      alert('Fehler beim Erstellen der Datenbank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = async () => {
    setIsLoading(true);
    try {
      const result = await onOpen();
      if (result.success) {
        alert('Datenbank wurde erfolgreich geöffnet!');
      }
    } catch (error) {
      alert('Fehler beim Öffnen der Datenbank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAll = async () => {
    setIsLoading(true);
    try {
      const result = await onExportAll();
      if (result.success) {
        alert('Alle Events wurden erfolgreich exportiert!');
      }
    } catch (error) {
      alert('Fehler beim Exportieren der Events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      const result = await onImport();
      if (result.success) {
        alert('Event wurde erfolgreich importiert!');
      } else if (result.error) {
        alert(`Fehler beim Importieren: ${result.error}`);
      }
    } catch (error) {
      alert('Fehler beim Importieren des Events');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-900">Datenbank-Verwaltung</h2>
      </div>

      <div className="space-y-4">
        {/* Current Database */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Aktuelle Datenbank</h3>
          <p className="text-sm text-gray-600 font-mono break-all">
            {currentDbPath || 'Keine Datenbank geladen'}
          </p>
        </div>

        {/* Database Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCreateNew}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neue Datenbank
          </button>
          
          <button
            onClick={handleOpen}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Datenbank öffnen
          </button>
        </div>

        {/* Export/Import Actions */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Export / Import</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExportAll}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Alle Events exportieren
            </button>
            
            <button
              onClick={handleImport}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Event importieren
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Beim Öffnen einer anderen Datenbank werden alle aktuellen Daten durch die neue Datenbank ersetzt. 
              Exportieren Sie wichtige Daten vor dem Wechsel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManager;