var apiKey = "15c4eb9670a0543f01c1871cf866b951";
var searchBtn = document.querySelector("#search-btn");
var searchInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(data);
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayForecast(data);
    });
}

