"use strict"
const apiKey = "1901fe7940f54bcba96192003251805"; 
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";

async function fetchWeatherData(query) {
    const url = `${baseUrl}?key=${apiKey}&${query}&days=3&aqi=no&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
    }


function displayWeather(data) {
    const weatherCards = document.getElementById("weatherCards");
    weatherCards.innerHTML = "";

    const today = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    data.forecast.forecastday.forEach((day, index) => {
        if (index < 3) { 
            const forecastDate = new Date(day.date);
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + index); 

            const dayName = daysOfWeek[currentDate.getDay()];
            const dayNumber = currentDate.getDate();
            const month = months[currentDate.getMonth()];

            const card = document.createElement("div");
            card.className = "card col-12 col-md-4";

            let content = `
        <h3>${dayName} ${dayNumber} ${month}</h3>
      `;

            if (index === 0) {
                const chanceOfRain = data.forecast.forecastday[0].day.daily_chance_of_rain; 
                const windSpeed = data.current.wind_kph;
                const windDirection = data.current.wind_dir; 

                content += `
          <h2>${data.current.temp_c}°C</h2>
          <div class="temp">${data.location.name}</div>
          <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">
          <div class="condition">${data.current.condition.text}</div>
          <div class="details">
            <div class="detail-item">
              <i class="fas fa-umbrella"></i>
              <span>${chanceOfRain}%</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-wind"></i>
              <span>${windSpeed}km/h</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-compass"></i>
              <span>${windDirection}</span>
            </div>
          </div>
        `;
            } else {
                const minTemp = day.day.mintemp_c; 
                const maxTemp = day.day.maxtemp_c; 
                content += `
          <div class="temp">${maxTemp}°C<br><span class="min-temp">${minTemp}°C</span></div>
          <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
          <div class="condition">${day.day.condition.text}</div>
        `;
            }

            card.innerHTML = content;
            weatherCards.appendChild(card);
        }
    });
}

window.onload = async () => {
    async function getWeatherByLocation() {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;
            await fetchWeatherData(`q=${latitude},${longitude}`);
        } catch (error) {
            console.error("Geolocation error:", error.message);
            await fetchWeatherData("q=abha");
        }
    }

    if (navigator.geolocation) {
        await getWeatherByLocation();
    } else {
        await fetchWeatherData("q=abha");
    }

    const cityInput = document.getElementById("cityInput");
    cityInput.addEventListener("input", async () => {
        const city = cityInput.value.trim();
        if (city) {
            await fetchWeatherData(`q=${city}`);
        }
    });
};