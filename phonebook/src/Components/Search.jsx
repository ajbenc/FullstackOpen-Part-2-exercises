import React from "react";

const Search = ({ filterName, setFilterName }) => {
  return (
    <div className="search-container">
      <h4>Search:{" "}</h4>
      <input
        type="text"
        value={filterName}
        onChange={(event) => setFilterName(event.target.value)}
      />
    </div>
  );
};

export default Search;
