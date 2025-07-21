import React from 'react';
import { Building2, Database } from 'lucide-react';

interface HeaderProps {
  currentDbPath: string;
}

const Header: React.FC<HeaderProps> = ({ currentDbPath }) => {
  const getDbName = (path: string) => {
    if (!path) return 'Keine Datenbank';
    return path.split(/[/\\]/).pop() || path;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo_servicepartner_messe.png" 
              alt="NürnbergMesse ServicePartner" 
              className="h-8"
            />
          </div>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-900">Event Management System</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Database className="w-4 h-4" />
          <span className="font-mono">{getDbName(currentDbPath)}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;