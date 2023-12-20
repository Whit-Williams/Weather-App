const todaysDate = dayjs();
const APIKey = "ac8576af81b6ad181cf41fde50c3a105";
let today = $("#today");
let forecast = $("#forecast");

// function to create and display history buttons
function displayHistory() {
  $("#history").empty();
  let history = JSON.parse(localStorage.getItem("Cities")) || [];
  for (let i = 0; i < history.length; i++) {
    let inputHistory = $("<button>")
      .text(history[i])
      .attr("class", "history-btn");
    $("#history").click(function (event) {
      search(event.target.innerText);
    });
    $("#history").prepend(inputHistory);
  }
}
displayHistory();

// function to search for cities using the OpenWeatherApp API that returns results
function search(previousCity) {
  //targets input value in search box or history buttons
  let city = previousCity || $("#search-input").val().toLowerCase();
// fetching data from API and converting to json format
  const currDayURL = fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey
  ).then((response) => response.json());
  const forecastURL = fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIKey
  ).then((response) => response.json());

  Promise.all([currDayURL, forecastURL]).then(([currDayURL, forecastURL]) => {
    // retrieves previously searched cities from local storage if applicable
    let history = JSON.parse(localStorage.getItem("Cities")) || [];
    // sets condition to only save searched city if it hasn't already been searched
    if (!history.includes(city)) {
      history.push(city);
      displayHistory();
      localStorage.setItem("Cities", JSON.stringify(history));
    };
    // creates all divs for weather information in current day section
    let title = $("<h3>").text("Today's Weather");
    let line = $("<hr>").attr("class", "hr weather-hr");
    let date = $("<div>").text(todaysDate.format(" DD MMMM YYYY"));
    let cityName = $("<div>").text(currDayURL.name);
    let iconId = currDayURL.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
    let weatherIcon = $("<img>").attr("src", iconUrl);
    let temp = $("<div>").text(
      "Temp: " + Math.floor([currDayURL.main.temp - 273.15], 2) + " °C"
    );
    let humidity = $("<div>").text(
      "Humidity: " + currDayURL.main.humidity + "%"
    );
    let wind = $("<div>").text("Wind: " + currDayURL.wind.speed + " KPH");
    // empties today div to only show info from one search at a time
    today.empty();
    today.attr("class", "col-lg-12");
    today.append(title, line, cityName, date, weatherIcon, temp, humidity, wind);
    forecast.empty();
    // creates divs for 5-day forecast section using for loop to create new div for each day
    let forecastTitle = $("<h4>").text("5-Day Forecast");
    forecast.prepend(forecastTitle);
    for (let i = 0; i < forecastURL.list.length; i++) {
      let showDay = forecastURL.list[i].dt_txt;
      const forecastIcon = forecastURL.list[i].weather[0].icon;
      let forecastIUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
      let forecastIconDiv = $("<img>").attr("src", forecastIUrl);
      let forecastTemp = $("<div>").text(
        "Temp: " +
          Math.floor([forecastURL.list[i].main.temp - 273.15], 2) +
          " °C"
      );
      let forecastHumidity = $("<div>").text(
        "Humidity: " + forecastURL.list[i].main.humidity + "%"
      );
      let forecastInfo = $("<div>")
        .attr("class", "col-lg-2 week-info")
        .text(showDay);
      if (!showDay.includes("09:00:00")) {
        forecastInfo.attr("class", "hide");
      }
      forecast.append(forecastInfo);
      forecastInfo.append(forecastIconDiv, forecastTemp, forecastHumidity);
    }
  });
}
// click functionality for the search button
$("#search-button").on("click", function (event) {
  event.preventDefault();
  search();
});
// click functionality for the clear history button
$("#clear-button").on("click", function (event) {
  event.preventDefault();
  localStorage.clear();
  $("#history").empty();
});
