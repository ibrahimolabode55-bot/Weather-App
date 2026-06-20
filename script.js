const loading = document.getElementById("loading");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const uvValue = document.getElementById("uvValue");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const uv = document.getElementById("uv");

const weatherIcon = document.getElementById("weatherIcon");

const error = document.getElementById("error-message");
const forecast = document.getElementById("forecast");

// Search for a city and display weather date
async function handleSearch() {
    try {
    if (!cityInput.value.trim()) {
        error.textContent = "Please enter a city name";
        return;
    }

    error.textContent = "";
    document.getElementById("loading").textContent = "Loading...";

    const city = cityInput.value;

    console.log("City entered:", city);


    const data = await getCoordinates(city);

    if (!data.results || data.results.length === 0) {
        document.getElementById("loading").textContent = "";
        error.textContent = "City not found";
        return;
    }

    const cityData = data.results[0];

    error.textContent = "";
    document.getElementById("loading").textContent = "";


    console.log("Latitude:", cityData.latitude);
    console.log("longitude:", cityData.longitude);

    const weatherData = await getWeather(
        cityData.latitude,
        cityData.longitude
    );

    document.getElementById("loading").textContent = "";

    const weatherInfo = getWeatherDescription(weatherData.current.weather_code);

    weatherIcon.textContent = weatherInfo.icon;

    description.textContent = weatherInfo.description;

    cityName.textContent = cityData.name +", "+ cityData.country;

    console.log(weatherData);

    temperature.textContent = weatherData.current.temperature_2m + "°c";

    humidity.textContent = weatherData.current.relative_humidity_2m + "%";

    wind.textContent = weatherData.current.wind_speed_10m + " km/h";

    uv.textContent = weatherData.current.uv_index;

    humidityValue.textContent = weatherData.current.relative_humidity_2m + "%";

    windValue.textContent = weatherData.current.wind_speed_10m + " km/h";

    uvValue.textContent = weatherData.current.uv_index + " UV";

    displayForecast(weatherData.daily);

    loading.textContent = "";

    console.log(weatherData.current.uv_index);

    console.log(weatherData.current.temperature_2m);

    console.log(temperature);

    console.log(weatherData.daily);

    console.log(weatherData.current);

    } catch (err) {
        console.error(err);
        document.getElementById("loading"),textContent = "";
        error.textContent = "Something went wrong. Please try again.";
    }
}

searchBtn.addEventListener("click", handleSearch); 

// Get latitude and logitude from city name
async function getCoordinates(city) {
    
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&1language=en&format=json`
    );

    const data = await response.json();

    return data;
}

// Get current weather and forecast data
async function getWeather(lat, lon) {

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weather_code&daily=temperature_2m_min,temperature_2m_max,weather_code&timezone=auto`
    );

    const data = await response.json();

    return data;
}

// Convert weather codes into readable descriptions
function getWeatherDescription(code) {
    if (code === 0) {
        return { description: "Clear Sky", icon: "☀" };
    }

    if ([1, 2, 3].includes(code)) {
        return { description: "Partly Cloudy", icon: "🌥" };
    }

    if ([45, 48].includes(code)) {
        return { description: "Foggy", icon: "🌫" };
    }

    if ([51, 53, 55, 80, 81, 82].includes(code)) {
        return { description: "Rain Showers", icon: "🌦" };
    }

    if ([61, 63, 65].includes(code)) {
        return { description: "Rain", icon: "🌧" };
    }

    if ([71, 73, 75].includes(code)) {
        return {description: "Snow", icon: "❄" };
    }

    if (code === 95) {
        return { description: "Thunderstorm", icon: "⛈" };
    }

    return { description: "Unknown", icon: "❓" };
}

// Display 5-day forecast cards
function displayForecast(daily) {
    console.log(daily);

    forecast.innerHTML = "";

    for (let i = 0; i < 5; i++) {

        const date = new Date(daily.time[i]);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const weatherInfo = getWeatherDescription(
            daily.weather_code[i]
        );

        forecast.innerHTML += `
        <div class="forecast-card">
        <h4>${dayName}</h4>
        <div>${weatherInfo.icon}</div>
        <p>${weatherInfo.description}</p>
        <p>${daily.temperature_2m_max[i]}°c</p>
        <p>${daily.temperature_2m_min[i]}°c</p>
        </div>
        `;
        console.log(daily.weather_code[i]);
    }
}

cityInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// Display error messages to the user
function showError(message) {
    error.textContent = message;
}