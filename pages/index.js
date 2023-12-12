'use client'
import { useState } from "react";
export default function Home() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [weatherData, setWeatherData] = useState('')

  const handleForeCast = async (e) => {
    e.preventDefault();
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Latitude and Longitude must be valid numbers');
      return;
    }
  
    try {
      const data = await fetchData(latitude, longitude);
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  const fetchData = async (latitude, longitude) => {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`)
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  }
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
    <>
      <div id="root">
        <h1>Weather Forecast</h1>
        <form onSubmit={handleForeCast}>
          <label>Latitude<input type='text' className="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} /></label>
          <label>Longitude<input type='text' className="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} /></label>
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
    </>
  );
}
