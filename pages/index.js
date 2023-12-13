import { useState } from "react";

export default function Home() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [forecastData, setForecastData] = useState([]);

  const handleGetForecast = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`);

      if (!response.ok) {
        throw new Error("Unable to fetch forecast data");
      }

      const data = await response.json();

      // Extracting relevant forecast data
      const extractedData = data.properties.timeseries.slice(0, 30).map((item) => {
        return {
          time: new Date(item.time).toLocaleString(),
          temperature: item.data.instant.details.air_temperature.toFixed(1),
          summary: item.data.next_1_hours.summary.symbol_code,
        };
      });

      setForecastData(extractedData);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  return (
    <>
      <div id="root">
        <h1>Weather Forecast</h1>
        <form onSubmit={handleGetForecast}>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            id="latitude"
            className="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            id="longitude"
            className="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
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
            <tbody>
              {forecastData.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.temperature}</td>
                  <td>{item.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
  );
}