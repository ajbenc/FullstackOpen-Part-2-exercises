import { useCountrySearch } from "../../hooks/useCountrySearch";
import "./SearchBar.css";

const SearchBar = ({ onSelectCountry }) => {
  const { query, setQuery, suggestions } = useCountrySearch();

  const handleSelect = (country) => {
    onSelectCountry(country);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a country..."
      />
      {/* Suggestions auto-close due to query reset */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((country) => (
            <li key={country.cca2} onClick={() => handleSelect(country)}>
              {country.name.common}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
