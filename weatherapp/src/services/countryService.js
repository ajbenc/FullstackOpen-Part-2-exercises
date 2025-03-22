export const searchCountries = async (name) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!response.ok) throw new Error('Country not found');
    return await response.json();
  };