import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (!isSearchMode) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const delay = setTimeout(fetchData, 300);
    return () => clearTimeout(delay);
  }, [query, isSearchMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsSearchMode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsSearchMode(true);
    setSelectedResult(null);
  };

  const handleSelectResult = (item) => {
    setSelectedResult(item);
    setQuery(item.title);
    setIsSearchMode(false);
    setResults([]);
  };

  const handleInputFocus = () => {
    setIsSearchMode(true);
    if (selectedResult) {
      setSelectedResult(null);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            🔍 <span>MiniSearch</span>
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm border px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        {/* Search input and dropdown */}
        <div className="relative mb-4" ref={inputRef}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search articles..."
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Search results dropdown */}
          {isSearchMode && results.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow mt-1 max-h-60 overflow-y-auto">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectResult(item)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected article content */}
        {selectedResult && (
          <div className="mt-8">
            <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow">
              <h2 className="text-2xl font-semibold mb-3">{selectedResult.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedResult.body}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Tags:</strong> {selectedResult.tags.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;