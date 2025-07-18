'use client';

import { useState, useEffect, useRef } from 'react';

interface TeamSelectorProps {
  value: string;
  onChange: (teamName: string) => void;
  placeholder: string;
  label: string;
}



export default function TeamSelector({ value, onChange, placeholder, label }: TeamSelectorProps) {
  const [teams, setTeams] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/analytics/teams');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const sortedTeams = data.teams.sort();
      setTeams(sortedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      // Use comprehensive fallback team list until /api/teams endpoint is added
      setTeams([
        'Alabama', 'Arizona', 'Arizona State', 'Arkansas', 'Auburn', 'Baylor', 'Boston College',
        'BYU', 'California', 'Cincinnati', 'Clemson', 'Colorado', 'Connecticut', 'Creighton',
        'Duke', 'Florida', 'Florida State', 'Georgetown', 'Georgia', 'Gonzaga', 'Houston',
        'Illinois', 'Indiana', 'Iowa', 'Iowa State', 'Kansas', 'Kansas State', 'Kentucky',
        'Louisville', 'LSU', 'Marquette', 'Maryland', 'Memphis', 'Miami', 'Michigan',
        'Michigan State', 'Minnesota', 'Mississippi State', 'Missouri', 'Nebraska',
        'North Carolina', 'Northwestern', 'Notre Dame', 'Ohio State', 'Oklahoma',
        'Oklahoma State', 'Oregon', 'Penn State', 'Pittsburgh', 'Purdue', 'Rutgers',
        'South Carolina', 'Stanford', 'Syracuse', 'TCU', 'Tennessee', 'Texas',
        'Texas A&M', 'Texas Tech', 'UCLA', 'USC', 'Utah', 'Vanderbilt', 'Villanova',
        'Virginia', 'Virginia Tech', 'Wake Forest', 'Washington', 'West Virginia', 'Wisconsin'
      ].sort());
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (teamName: string) => {
    onChange(teamName);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    onChange(inputValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
              Loading teams...
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="py-1">
              {filteredTeams.slice(0, 100).map((team, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(team)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150"
                >
                  <div className="font-medium text-gray-900">{team}</div>
                </button>
              ))}
              {filteredTeams.length > 100 && (
                <div className="px-4 py-2 text-sm text-gray-500 text-center border-t">
                  Showing first 100 results. Keep typing to narrow down...
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No teams found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
} 