'use client'
import { useState } from "react";
export default function WeatherForecastApp() {
  // State variables
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  // Fetch weather data
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if(isNaN(latitude) || isNaN(longitude)){
      return;
     }
    fetchWeatherData();
  };

  // Render table rows
  const renderTableRows = () => {
    if (!weatherData || !weatherData.properties || !weatherData.properties.timeseries) {
      return null;
    }

    const first30TimeSeries = weatherData.properties.timeseries.slice(0, 30);

    return first30TimeSeries.map((forecast) => {
      const time = new Date(forecast.time).toLocaleString();
      const temperature = forecast.data.instant.details.air_temperature.toFixed(1);
      const summary = forecast.data.next_1_hours.summary.symbol_code;

      return (
        <tr key={forecast.time}>
          <td>{time}</td>
          <td>{temperature} °C</td>
          <td>{summary}</td>
        </tr>
      );
    });
  };

  return (
    <div id="root">
      <h1>Weather Forecast</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          Latitude:
          <input type="text" className="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </label>
        <label>
          Longitude:
          <input type="text" className="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </label>
        <button type="submit">Get Forecast</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature (°C)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
}
