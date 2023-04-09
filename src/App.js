import React, { useState, useEffect } from "react";
import TopBar from './components/TopBar';
import Forecast from './components/Forecast';
import Current from './components/Current';
import WeatherIcons from "./WeatherIcons";

import './App.css';

function App() {

  const [query, setQuery] = useState({ q: 'Denver' });
  const [weather, setWeather] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getWeatherData({ ...query })
        .then((data) => {
          setWeather(data);
          console.log(weather);
        })
    }
    fetchData()
      .catch(console.error);
  }, [query]);

  const getWeatherData = async () => {
    const formattedWeather = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=API_KEY&q=${query.q}`)
      .then((response) => response.json())
      .then(formatWeather);
    return { ...formattedWeather };
  };

  const formatWeather = (data) => {
    const {
      location: { name, region, country },
      current: { temp_f, condition, wind_mph, wind_dir, humidity, pressure_in },
      forecast: { forecastday }
    } = data

    const formatIcon = WeatherIcons.find(({ code }) => code === condition.code)

    const hourlyArr = [];
    hourlyArr.push(forecastday[0].hour[2]);
    hourlyArr.push(forecastday[0].hour[5]);
    hourlyArr.push(forecastday[0].hour[8]);
    hourlyArr.push(forecastday[0].hour[11]);
    hourlyArr.push(forecastday[0].hour[14]);
    hourlyArr.push(forecastday[0].hour[17]);
    hourlyArr.push(forecastday[0].hour[20]);
    hourlyArr.push(forecastday[0].hour[23]);

    return {
      name,
      region,
      country,
      temp_f,
      condition,
      wind_mph,
      wind_dir,
      humidity,
      pressure_in,
      forecastday,
      hourlyArr,
      formatIcon
    };
  };


  return (
    <div className="App">
      <div className="gridContainer">
        <div className="TopBar">
          <TopBar setQuery={setQuery} />
        </div>
        <div className="Current">
          {weather && (
            <Current weather={weather} />
          )}
        </div>
        <div className="Forecast">
          <div className="DayHourly">
            {weather && (
              weather.hourlyArr.map(hour => (
                <div class='forecastContainer' key={weather.forecastday[0].hour.time_epoch}>
                  <Forecast hour={hour} />
                </div>
              )
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
