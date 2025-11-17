// Объект для управления UI
const UI = {
    // Получаем элементы формы
    getFormElements() {
        return {
            latInput: document.getElementById('latitude'),
            lonInput: document.getElementById('longitude'),
            submitBtn: document.getElementById('getWeatherBtn'),
            resultDiv: document.getElementById('weatherResult'),
            tempDiv: document.getElementById('temperature')
        };
    },

    // Показываем ошибку
    showError(message) {
        const elements = this.getFormElements();
        elements.resultDiv.innerHTML = `
            <div style="color: red; font-size: 24px;">
                ⚠️ ${message}
            </div>
        `;
    },

    // Показываем загрузку
    showLoading() {
        const elements = this.getFormElements();
        elements.submitBtn.disabled = true;
        elements.submitBtn.textContent = 'Загрузка...';
        elements.resultDiv.innerHTML = `
            <div style="font-size: 24px;">
                ⏳ Получение данных...
            </div>
        `;
    },

    // Убираем состояние загрузки
    hideLoading() {
        const elements = this.getFormElements();
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'Показать погоду';
    },

    // Показываем погоду
    displayWeather(weatherData) {
        const elements = this.getFormElements();
        
        elements.resultDiv.innerHTML = `
            <div class="weather-card">
                <h2>${weatherData.cityName}, ${weatherData.country}</h2>
                <div class="temperature">${weatherData.temperature}°</div>
                <div class="description">${weatherData.description}</div>
                <div class="weather-details">
                    <p>Ощущается как: ${weatherData.feelsLike}°</p>
                    <p>Влажность: ${weatherData.humidity}%</p>
                    <p>Ветер: ${weatherData.windSpeed} м/с</p>
                    <p>Давление: ${weatherData.pressure} гПа</p>
                </div>
            </div>
        `;
    },

    // Получаем значения из полей ввода
    getInputValues() {
        const elements = this.getFormElements();
        return {
            latitude: elements.latInput.value.trim(),
            longitude: elements.lonInput.value.trim()
        };
    }
};