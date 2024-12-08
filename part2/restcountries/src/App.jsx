import {useState , useEffect} from "react";
import axios from "axios"

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("search countries");
  const [selectedCountry, setSelectedCountry] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [weather, setWeather] = useState(null);




  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all") 
      .then(response => setCountries(response.data))
  }, []);


  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    setSelectedCountry(null); 
    setWeather(null); 
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
    setWeather(null);

    const latAndLong = country.latlng
    const lat = latAndLong[0]
    const lon = latAndLong[1]
    axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    )
      .then((response) => setWeather(response.data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeather({ error: "Failed to fetch weather data" });
    });

  };

     



  return (
    <div>
      <input
        value={query}
        onChange={handleSearchChange}
      />

      {query === "" && <p></p>}

      {filteredCountries.length > 10 && <p>Too many matches, specify another filter.</p>}
      
      {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>{country.name.common} <button onClick= {() => handleShowCountry(country)}>show</button></li>
          ))}
        </ul>
      )}

      {filteredCountries.length === 1 || selectedCountry ? (
        <div>
          <h2>{selectedCountry ? selectedCountry.name.common : filteredCountries[0].name.common}</h2>
          <p>Capital: {selectedCountry ? selectedCountry.capital[0] : filteredCountries[0].capital[0]}</p>
          <p>Area: {selectedCountry ? selectedCountry.area : filteredCountries[0].area} km²</p>
          <h3>Languages</h3>
          <ul>
            {(selectedCountry ? selectedCountry.languages : filteredCountries[0].languages) &&
              Object.entries(selectedCountry ? selectedCountry.languages : filteredCountries[0].languages).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
          </ul>
          <img src={selectedCountry ? selectedCountry.flags.png : filteredCountries[0].flags.png} alt="flag" width="150" />


          {weather && !weather.error && (
            <div>
              <h3>Weather in {selectedCountry.capital[0]}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Condition: {weather.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}

          {weather && weather.error && <p>{weather.error}</p>}

        </div>
      ) : null}


    </div>
  )

}

export default App