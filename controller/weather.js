const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const hourOptions = { hour: '2-digit', minute: '2-digit' };
let current_day = 0;
L.mapquest.key = 'T9o1R4SclpyFM11hEk7p4F2Pz8SCXFmf';

function pressingEnterInInput(e) {
  if (e.keyCode === 13)
    document.querySelector('.search-icon').click();
}

async function getCityName(city_name) {
  let city_name_tab = city_name.split(" ");
  if (city_name_tab.length === 2 && !isNaN(city_name_tab[0]) && !isNaN(city_name_tab[1])) {
    city_name = "lat=" + city_name_tab[0].toString() + "lng=" + city_name_tab[1].toString();
  } else if (!isNaN(city_name)) {
    if (city_name.length !== 5) {
      city_name = "ERROR";
    } else {
      let postcodeToCityName = "https://api-adresse.data.gouv.fr/search/?q=postcode=" + city_name;
      const res = await fetch(postcodeToCityName)
      const data = await res.json();
      if (data.features.length === 0) {
        city_name = "ERROR";
      }
      else {
        city_name = data.features[0].properties.city;
      }
    }
  } else {
    city_name = deleteAccent(city_name);
    if (city_name_tab.length > 1)
      city_name = city_name.split(" ")[1];
  }
  return city_name;
}

function getCurrentWeather(data) {

  let today = new Date();
  document.querySelector("#date").textContent = today.toLocaleDateString('fr-FR', dateOptions);
  document.querySelector("#hour").textContent = today.toLocaleTimeString('fr-FR', hourOptions);

  document.querySelector("#weather-icon").src = data.current_condition.icon_big;

  document.querySelector("#temperature").textContent = data.current_condition.tmp;
  document.querySelector("#weather").textContent = data.current_condition.condition;

  document.querySelector("#humidity").textContent = data.current_condition.humidity;

  document.querySelector("#sunrise").textContent = data.city_info.sunrise;
  document.querySelector("#sunset").textContent = data.city_info.sunset;

  document.querySelector("#wind-speed").textContent = data.current_condition.wnd_spd;

}

function averageWeatherWindow(data) {
  let selection = data["fcst_day_" + current_day.toString()];
  let today = new Date();
  let chosen_day = new Date(today);
  chosen_day.setDate(chosen_day.getDate() + current_day);

  document.querySelector("#date").textContent = chosen_day.toLocaleDateString('fr-FR', dateOptions);

  document.querySelector("#weather").textContent = selection.condition;
  document.querySelector("#weather-icon").src = selection.icon_big;
  document.querySelector("#data-table").style.display = "none";
  document.querySelector("#temperature").textContent = selection.tmin;
  document.querySelector("#tmax").textContent = " - " + selection.tmax;

  document.querySelector("#hour").style.display = "none";
  document.querySelector("#tmax").style.display = "inline-block";
  document.querySelector("#degree").style.display = "inline-block";

}

function getWeatherByHour(id, data) {
  let selection = data["fcst_day_" + current_day].hourly_data[id.split("-")[1] + "H00"];
  let today = new Date();
  let chosen_day = new Date(today);
  chosen_day.setDate(chosen_day.getDate() + current_day);
  chosen_day.setHours(id.split("-")[1]);
  chosen_day.setMinutes(0);
  chosen_day.setSeconds(0);
  document.querySelector("#date").textContent = chosen_day.toLocaleDateString('fr-FR', dateOptions);
  document.querySelector("#hour").textContent = chosen_day.toLocaleTimeString('fr-FR', hourOptions);

  document.querySelector("#weather-icon").src = selection.ICON.replace(".png", "-big.png");
  document.querySelector("#weather").textContent = selection.CONDITION;

  document.querySelector("#temperature").textContent = selection.TMP2m;
}

// Update the page 
function update(id, data) {

  document.querySelector("#tmax").style.display = "none";
  document.querySelector("#degree").style.display = "none";
  document.querySelector("#data-table").style.display = "block";
  document.querySelector("#hour").style.display = "block";

  if (id === "current-weather") {
    getCurrentWeather(data);
  }
  else if (id === "average-weather") {
    averageWeatherWindow(data);
  }
  else {
    getWeatherByHour(id, data);
  }
  let items = document.querySelectorAll(".item");
  for (let i = 0; i < items.length; i++) {
    items[i].style.backgroundColor = "#F5F5F5";
  }

}

// Day selection
function goToNextDay(data) {
  if (current_day < 4) {
    if (current_day === 0) {
      document.querySelector('#previous-day-icon i').classList.add("hover-activated");
    } else if (current_day === 3) {
      document.querySelector('#next-day-icon i').classList.remove("hover-activated");
    }
    current_day++;
    updateHorizontalScrollMenuItems(data);
    update("average-weather", data);
    document.querySelector("#average-weather").style.backgroundColor = "#95b7ff";
    document.querySelector('#current-weather').style.display = "none";
    document.querySelector("#current-weather").scrollIntoView({
      behavior: "smooth",
    });
  }
}

function goToPreviousDay(data) {
  if (current_day > 0) {
    if (current_day === 4) {
      document.querySelector('#next-day-icon i').classList.add("hover-activated");
    } else if (current_day === 1) {
      document.querySelector('#previous-day-icon i').classList.remove("hover-activated");
      document.querySelector('#current-weather').style.display = "block";
    }
    current_day--;
    updateHorizontalScrollMenuItems(data);
    update("average-weather", data);
    document.querySelector("#average-weather").style.backgroundColor = "#95b7ff";
    document.querySelector("#current-weather").scrollIntoView({
      behavior: "smooth",
    });
  }
}

function itemOnClick(data, id) {
  if (hasMoved)
    return;
  else {
    update(id, data);
    document.querySelector("#" + id.toString()).style.backgroundColor = "#95b7ff";
  }
}

function updateHorizontalScrollMenuItems(data) {
  let selection = data["fcst_day_" + current_day.toString()]
  document.querySelector("#img-current").src = data.current_condition.icon;
  document.querySelector("#img-average").src = selection.icon;
  for (hour in data["fcst_day_" + current_day].hourly_data) {
    let selection = data["fcst_day_" + current_day].hourly_data[hour];
    let id = "#img" + hour;
    document.querySelector(id).src = selection.ICON;
  }

  let items = document.querySelectorAll(".item");
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', () => { itemOnClick(data, items[i].id) });
  }
}

// Wrap every letter in a span
var textWrapper = document.querySelector('.meteo .meteo-letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='meteo-letter'>$&</span>");
textWrapper = document.querySelector('.error .error-letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='error-letter'>$&</span>");

function hideData() {
  document.querySelector("#data").style.display = "none";
  document.querySelector(".scroll").style.display = "none";
  document.querySelector("#tmax").style.display = "none";
  document.querySelector("#degree").style.display = "none";
}

async function fetchByName() {
  let city_name = document.querySelector(".search-input").value;
  city_name = await getCityName(city_name);
  let key = city_name.toLowerCase();
  let index = isInMemoryByKey(key)
  if (index !== getMemoryLength()) {
    city_name = getElementAtIndex(index)[1];
    let lat = getElementAtIndex(index)[2];
    let lng = getElementAtIndex(index)[3];
    fetchByLocation(city_name, lat, lng);
    L.mapquest.geocoding().geocode(city_name);
  }
  else {
    let request = 'https://www.prevision-meteo.ch/services/json/' + city_name;
    search(request);
  }

}

function fetchByLocation(city_name, lat, lng) {
  let request = 'https://www.prevision-meteo.ch/services/json/lat=' + lat.toString() + "lng=" + lng.toString();
  search(request);
  document.querySelector("#city-name").textContent = city_name;
}

function displayContent() {
  let timeout = 0;
  if (document.querySelector("#map-container").style.top !== "-600px") {
    timeout = 600;
    document.querySelector("#map-container").style.top = "-600px";
  }
  setTimeout(function () {
    document.querySelector("#data").style.display = "block";
    document.querySelector(".scroll").style.display = "block";
    hideMeteo();
    // Hide error message
    if (document.querySelector(".error").style.display === "block") {
      document.querySelector(".search").style.boxShadow = "0 3px 2px #9599A5";
      textHide();
    }
  }, timeout);
}

// Init event listeners on previous and next day
function initPreviousNextDay(data) {
  let previousDay = document.querySelector("#previous-day i");
  let nextDay = document.querySelector("#next-day i");
  let previousDayClone = previousDay.cloneNode(true);
  let nextDayClone = nextDay.cloneNode(true);

  previousDay.parentNode.replaceChild(previousDayClone, previousDay);
  nextDay.parentNode.replaceChild(nextDayClone, nextDay);
  previousDayClone.classList.remove("hover-activated");

  // Add event listener
  previousDayClone.addEventListener('click', () => { goToPreviousDay(data) });
  nextDayClone.addEventListener('click', () => { goToNextDay(data) });
  if (!document.querySelector('#next-day-icon i').classList.contains("hover-activated"))
    document.querySelector('#next-day-icon i').classList.add("hover-activated");
}

// Hide all and display error message
function fetchErrorManagement() {
  let timeout = 0;
  if (document.querySelector("#map-container").style.top !== "-600px") {
    timeout = 600;
    document.querySelector("#map-container").style.top = "-600px";
  }
  setTimeout(function () {
    document.querySelector(".search").style.boxShadow = "0 0 3px 2px red";
    hideData();
    showMeteo();
    textAppear();
  }, timeout);
}

// Function of the searchbar
function search(request) {
  fetch(request)
    .then(res => res.json())
    .then((data) => {
      if (data.errors === undefined) {
        current_day = 0;
        if (data.city_info.name != "NA") {
          document.querySelector("#city-name").textContent = data.city_info.name;
          L.mapquest.geocoding().geocode(data.city_info.name);

        }
        update("current-weather", data);
        // Display data's div  
        if (document.querySelector("#data").style.display === "" || document.querySelector("#data").style.display === "none") {
          displayContent();
        }
        // Add current-weather div in horizontal menu
        document.querySelector("#current-weather").style.backgroundColor = "#95b7ff";
        document.querySelector('#current-weather').style.display = "block";
        updateHorizontalScrollMenuItems(data);
        document.querySelector("#current-weather").scrollIntoView({
          behavior: "smooth",
        });
        // Remove event listener
        initPreviousNextDay(data);
      }
      else {
        fetchErrorManagement();
      }
    })
}

// Initialize the horinzontal menu
function initHorizontalMenuItems() {
  let leftItem = document.createElement("div");
  let currentWeather = document.createElement("div");
  let averageWeather = document.createElement("div");
  let img = document.createElement("img");
  let p = document.createElement("p");
  let rightItem = document.createElement("div");

  leftItem.id = "left-item";
  document.querySelector(".items").appendChild(leftItem);

  currentWeather.className = "item";
  currentWeather.id = "current-weather";
  img.id = "img-current";
  img.alt = "current_weather"
  p.textContent = "Actuel";
  currentWeather.appendChild(img);
  currentWeather.appendChild(p);
  document.querySelector(".items").appendChild(currentWeather);

  averageWeather.className = "item";
  averageWeather.id = "average-weather";
  img = document.createElement("img");
  img.id = "img-average";
  img.alt = "average-weather"
  p = document.createElement("p");
  p.textContent = "Moyenne";
  averageWeather.appendChild(img);
  averageWeather.appendChild(p);
  document.querySelector(".items").appendChild(averageWeather);

  // Creates one div element for each hour
  for (i = 0; i < 24; i++) {
    let item = document.createElement("div");
    item.className = "item";
    item.id = "hour-" + i.toString();
    img = document.createElement("img");
    img.id = "img" + i.toString() + "H00";
    img.alt = "weather-at-" + i.toString() + "H00";
    p = document.createElement("p");
    p.textContent = i.toString() + "H00";
    item.appendChild(img);
    item.appendChild(p);
    document.querySelector(".items").appendChild(item);
  }

  rightItem.id = "right-item";
  document.querySelector(".items").appendChild(rightItem);
}

function displayMap() {
  hideData();
  hideMeteo();
  document.querySelector("#map-container").style.top = "50%";
}

function initMap() {
  let map = L.mapquest.map('map', {
    center: [44.8430557, -0.5750000],
    layers: L.mapquest.tileLayer('map'),
    zoom: 14
  });

  map.on('click', function (e) {
    L.mapquest.geocoding().reverse(e.latlng, generateContent);
  });

  function generateContent(error, response) {
    var location = response.results[0].locations[0];
    var providedLocation = response.results[0].providedLocation.latLng;
    var city = location.adminArea5;
    document.querySelector(".search-input").value = city;
    fetchByLocation(city, providedLocation.lat, providedLocation.lng);
    let key = deleteAccent(city.toString().toLowerCase()).split(" ")[0];
    addInMemory([key, city, providedLocation.lat, providedLocation.lng]);
    L.mapquest.geocoding().geocode(city);

  }
}

window.onload = function () {
  // Horizontal scroll controller
  showMeteo();
  initMap();
  initHorizontalMenuItems();
  document.querySelector(".search-icon").addEventListener('click', fetchByName);
  document.querySelector(".search-input").addEventListener('keypress', pressingEnterInInput);
  document.querySelector(".map-icon").addEventListener('click', displayMap);
}

