import { useState, useEffect } from 'react';
import { searchCountries } from '../services/countryService';

export const useCountrySearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      if (query.trim()) {
        try {
          const countries = await searchCountries(query);
          setSuggestions(countries);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
      }
    };

    const debounceTimer = setTimeout(fetchCountries, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { query, setQuery, suggestions };
};