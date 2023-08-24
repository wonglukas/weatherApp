document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '';                                          // add openweather api key here
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    const currentTemperature = document.getElementById('currentTemperature');
    const currentDescription = document.getElementById('currentDescription');
    const currentDate = document.getElementById('currentDate');
    const precipitationChance = document.getElementById('precipitationChance');
    const forecastList = document.getElementById('forecastList');

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            fetchWeatherData(city);
        }
    });

    async function fetchWeatherData(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
            const data = await response.json();

            const current = data.list[0];
            const dailyForecast = getDailyForecast(data.list);

            currentDate.innerHTML = `<strong>Date:</strong> ${getCurrentLocalTime(current.dt, data.city.timezone)}`;
            currentTemperature.innerHTML = `<strong>Temperature:</strong> ${current.main.temp}°C`;
            currentDescription.innerHTML = `<strong>Condition:</strong> ${current.weather[0].description}`;
            precipitationChance.innerHTML = `<strong>Precipitation Chance:</strong> ${current.pop}%`;

            forecastList.innerHTML = dailyForecast.map(item => {
                const date = new Date(item.dt * 1000);
                const minTemp = item.main.temp_min;
                const maxTemp = item.main.temp_max;
                const pop = item.pop;
                return `<li><strong>${date.toDateString()}:</strong> ${minTemp}°C - ${maxTemp}°C, <strong>Precipitation chance:</strong> ${pop}%</li>`;
            }).join('');
        } catch (error) {
            console.error(error);
            currentTemperature.textContent = 'Error fetching weather data';
            currentDescription.textContent = '';
            currentTime.textContent = '';
            precipitationChance.textContent = '';
            forecastList.innerHTML = '';
        }
    }

    function getDailyForecast(forecastData) {
        const dailyForecast = [];
        const uniqueDates = {};

        forecastData.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!uniqueDates[date]) {
                uniqueDates[date] = true;
                dailyForecast.push(item);
            }
        });

        return dailyForecast.slice(0, 7);
    }

    function getCurrentLocalTime(timestamp, timezoneOffset) {
        const utcTime = new Date(timestamp * 1000);
        const offsetInMinutes = timezoneOffset / 60; // Convert seconds to minutes
        const localTime = new Date(utcTime.getTime() + (offsetInMinutes * 60 * 1000)); // Convert offset to milliseconds
        return localTime.toLocaleDateString('en-US');
    }
});
