var apiKey = "15c4eb9670a0543f01c1871cf866b951";
var searchBtn = document.querySelector("#search-btn");
var searchInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getWeather(city, countryCode) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&units=metric&appid=${apiKey}`
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

function displayError(message) {
  var errorEl = document.querySelector(".error");
  if (errorEl) {
    errorEl.remove();
  }
  errorEl = document.createElement("div");
  errorEl.classList.add("error");
  errorEl.textContent = message;
  currentWeatherEl.appendChild(errorEl);
}

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var cityInput = searchInput.value.trim();
    if (!cityInput) {
      displayError("Please enter a city name");
      return;
    }
    var city = "";
    var countryCode = "";
    if (cityInput.includes(",")) {
      var parts = cityInput.split(",");
      city = parts[0].trim();
      countryCode = parts[1].trim().toUpperCase();
    } else {
      city = cityInput;
    }
    getWeather(city, countryCode);
    searchHistory.push(cityInput);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    displaySearchHistory();
    searchInput.value = "";
    currentWeatherEl.removeChild(currentWeatherEl.lastChild);
  });
  
