const todaysDate = dayjs();
const APIKey = "ac8576af81b6ad181cf41fde50c3a105";
let city; // check this
let today = $("#today");
let forecast = $("#forecast");

// Here we are building the URL we need to query the database
const currDayURL = fetch(
  "https://api.openweathermap.org/data/2.5/weather?q=london" +
    city +
    "&appid=" +
    APIKey
).then((response) => response.json());
const forecastURL = fetch(
  "https://api.openweathermap.org/data/2.5/forecast?q=london" +
    city +
    "&appid=" +
    APIKey
).then((response) => response.json());

Promise.all([currDayURL, forecastURL]).then(([currDayURL, forecastURL]) => {
  console.log(currDayURL, forecastURL);
  $("#search-button").on("click", function(event) {

   event.preventDefault();
//   let city = $("#search-input").val();
//   let inputHistory = $("<button>").text(city).attr("class", "history-btn");
//   $("#history").prepend(inputHistory);

  let date = $("<div>").text(todaysDate.format(" DD MMMM YYYY"));
  let cityName = $("<div>").text(currDayURL.name);
  let iconId = currDayURL.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
  let weatherIcon = $("<img>").attr("src", iconUrl);
  let temp = $("<div>").text(
    "Temp: " + Math.floor([currDayURL.main.temp - 273.15], 2) + " °C"
  ); // CHECK HERE FOR ACCURACY
  let humidity = $("<div>").text("Humidity: " + currDayURL.main.humidity + "%");
  let wind = $("<div>").text("Wind: " + currDayURL.wind.speed + " KPH");
  today.attr("class", "col-lg-12");
  today.append(cityName, date, weatherIcon, temp, humidity, wind);

  for (let i = 0; i < forecastURL.list.length; i++){
    let showDay = forecastURL.list[i].dt_txt;
     const forecastIcon = forecastURL.list[i].weather[0].icon;
    let forecastIUrl = `https://openweathermap.org/img/wn/${forecastIcon}@2x.png`;
    let forecastIconDiv = $("<img>").attr("src", forecastIUrl);
    let forecastTemp = 
        $("<div>").text("Temp: " + Math.floor([forecastURL.list[i].main.temp - 273.15], 2) + " °C");
      let forecastHumidity = $("<div>").text("Humidity: " + forecastURL.list[i].main.humidity + "%");
      let forecastInfo = $("<div>").attr("class", "col-lg-2 week-info").text(showDay);
      if (!showDay.includes("09:00:00")) {
        forecastInfo.attr("class", "hide"); };
      forecast.append(forecastInfo);
      forecastInfo.append(forecastIconDiv, forecastTemp, forecastHumidity);
  };
  
});
});
