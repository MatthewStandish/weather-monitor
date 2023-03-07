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

function displayForecast(data) {
  var forecastHTML = "";
  for (var i = 0; i < data.list.length - 1; i += 8) {
    var forecastData = data.list[i];
    var fahrenheitTemp = (forecastData.main.temp_max * 9) / 5 + 32;
    forecastHTML += `
          <div class="col">
            <div class="card bg-primary text-white">
              <div class="card-body p-2">
                <h5>${new Date(forecastData.dt_txt).toLocaleDateString()}</h5>
                <p><img src="https://openweathermap.org/img/w/${
                  forecastData.weather[0].icon
                }.png" alt="${forecastData.weather[0].main}" /></p>
                <p>Temp: ${fahrenheitTemp.toFixed(1)}&deg;F</p>
                <p>Humidity: ${forecastData.main.humidity}%</p>
                <p>Wind Speed: ${forecastData.wind.speed.toFixed(1)} MPH</p>
              </div>
            </div>
          </div>
        `;
  }
  forecastEl.innerHTML = forecastHTML;
}

var searchHistoryEl = document.querySelector("#search-history");

function displaySearchHistory() {
  var searchHistoryEl = document.querySelector("#search-history");
  searchHistoryEl.innerHTML = "";

  for (var i = 0; i < searchHistory.length; i++) {
    var liEl = document.createElement("li");
    liEl.textContent = searchHistory[i];
    searchHistoryEl.appendChild(liEl);
  }

  var clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Search History";
  clearBtn.setAttribute("id", "clear-history");
  searchHistoryEl.appendChild(clearBtn);

  if (searchHistory.length === 0) {
    clearBtn.style.display = "none";
  }

  clearBtn.addEventListener("click", function () {
    searchHistory = [];
    localStorage.setItem("search", JSON.stringify(searchHistory));
    displaySearchHistory();
    clearBtn.style.display = "none";
  });
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

searchHistoryEl.addEventListener("click", function (event) {
  if (event.target.matches("#clear-history")) {
    localStorage.removeItem("search");
    searchHistory = [];
    displaySearchHistory();
  }
});

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityInput = searchInput.value.trim();
  var city = "";
  var countryCode = "";
  if (cityInput.includes(",")) {
    var parts = cityInput.split(",");
    city = parts[0].trim();
    countryCode = parts[1].trim().toUpperCase();
  } else {
    city = cityInput;
  }
  if (city) {
    getWeather(city, countryCode);
    searchHistory.push(cityInput);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    searchInput.value = "";

    if (searchHistory.length > 0) {
      displaySearchHistory();
    }
  } else {
    displayError("Please enter a city name");
  }
});

if (searchHistory.length > 0) {
  displaySearchHistory();
  searchHistoryEl.addEventListener("click", function (event) {
    if (event.target.matches("li")) {
      var searchText = event.target.textContent.trim();
      searchInput.value = searchText;
    }
  });
  
}
