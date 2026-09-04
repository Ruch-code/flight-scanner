import { useState, useRef, useEffect } from 'react';
import { Airport } from '../types';
import { searchAirports } from '../data/airports';

interface Props {
  label: string;
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
}

function AirportSearch({ label, value, onChange, placeholder = 'Search city or airport' }: Props) {
  const [query, setQuery] = useState(value ? `${value}` : '');
  const [results, setResults] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Airport | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      onChange(selected.iata);
      setQuery(`${selected.city}, ${selected.country} (${selected.iata})`);
      setOpen(false);
    }
  }, [selected, onChange]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setSelected(null);
    setResults(searchAirports(q));
    setOpen(true);
  };

  const currentAirport = selected || (value ? undefined : null);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => {
          if (!selected) {
            setResults(searchAirports(''));
            setOpen(true);
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 bg-white placeholder:text-gray-400"
      />
      {currentAirport && (
        <div className="mt-1 text-xs text-primary-600 font-medium">
          ✓ {currentAirport.name}
        </div>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
          {results.map((airport) => (
            <li key={airport.iata}>
              <button
                type="button"
                onClick={() => setSelected(airport)}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{airport.city}</span>
                    <span className="text-gray-500 text-sm"> · {airport.country}</span>
                  </div>
                  <span className="text-sm font-bold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                    {airport.iata}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{airport.name}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-700 mb-1">No airports found for "{query.trim()}"</p>
          <p>Try a city name (e.g. Delhi), country, or 3-letter IATA code. Example: DEL, LHR, JFK</p>
        </div>
      )}
    </div>
  );
}

export default AirportSearch;