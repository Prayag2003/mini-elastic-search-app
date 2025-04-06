import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/search?q=${query}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const delay = setTimeout(fetchData, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelectSuggestion = (title) => {
    setQuery(title);
    setShowDropdown(false);
    // 👇 Do NOT re-fetch here, just keep existing results
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto px-4 py-10 relative">
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
        <div className="relative mb-10 z-50">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search articles..."
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Autocomplete dropdown */}
          {showDropdown && results.length > 0 && (
            <ul className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow mt-1 max-h-60 overflow-y-auto">
              {results.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleSelectSuggestion(item.title)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search results */}
        <div className="relative z-0 space-y-6">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow"
            >
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{item.body}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <strong>Tags:</strong> {item.tags.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
