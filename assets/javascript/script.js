var apiKey = "15c4eb9670a0543f01c1871cf866b951";
var searchBtn = document.querySelector("#search-btn");
var searchInput = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastEl = document.querySelector("#forecast");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];