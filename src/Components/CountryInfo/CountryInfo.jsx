const CountryInfo = ({ country }) => {
  if (!country) return null;

  return (
    <div className="country-info">
      <h2>{country.name.common}</h2>
      <img src={country.flags.png} alt={`${country.name.common} flag`} />
      <div className="country-details">
        <p><strong>Capital:</strong> {country.capital?.[0]}</p>
        <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
        <div className="languages">
          <h3>Languages</h3>
          <ul>
            {Object.values(country.languages || {}).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;