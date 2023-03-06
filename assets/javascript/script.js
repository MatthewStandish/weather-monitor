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

function displayCurrentWeather(data) {
    var fahrenheitTemp = (data.main.temp * 9) / 5 + 32;
    currentWeatherEl.innerHTML = `
      <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
      <div>Temperature: ${fahrenheitTemp.toFixed(1)} &deg;F</div>
      <div>Humidity: ${data.main.humidity}%</div>
      <div>Wind Speed: ${data.wind.speed.toFixed(1)} MPH</div>
    `;
  }

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var city = searchInput.value.trim();
  if (city) {
    getWeather(city);
    searchHistory.push(city);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    displaySearchHistory();
    searchInput.value = "";
  } else {
    alert("Please enter a city name");
  }
});
