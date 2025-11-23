// Объект для управления UI
const UI = {
    widgets: [], // Массив для хранения виджетов
    currentMode: 'coords', // Текущий режим: 'coords' или 'city'

    // Получаем элементы формы
    getFormElements() {
        return {
            latInput: document.getElementById('latitude'),
            lonInput: document.getElementById('longitude'),
            cityInput: document.getElementById('cityName'),
            submitBtn: document.getElementById('getWeatherBtn'),
            widgetsContainer: document.getElementById('widgetsContainer'),
            coordsMode: document.getElementById('coordsMode'),
            cityMode: document.getElementById('cityMode'),
            coordsSearch: document.getElementById('coordsSearch'),
            citySearch: document.getElementById('citySearch')
        };
    },

    // Инициализация переключателя режимов
    initModeToggle() {
        const elements = this.getFormElements();
        
        elements.coordsMode.addEventListener('click', () => {
            this.switchMode('coords');
        });

        elements.cityMode.addEventListener('click', () => {
            this.switchMode('city');
        });
    },

    // Переключение режима
    switchMode(mode) {
        const elements = this.getFormElements();
        this.currentMode = mode;

        if (mode === 'coords') {
            elements.coordsMode.classList.add('active');
            elements.cityMode.classList.remove('active');
            elements.coordsSearch.classList.add('active');
            elements.citySearch.classList.remove('active');
        } else {
            elements.cityMode.classList.add('active');
            elements.coordsMode.classList.remove('active');
            elements.citySearch.classList.add('active');
            elements.coordsSearch.classList.remove('active');
        }
    },

    // Показываем ошибку (временное сообщение)
    showError(message) {
        // Создаём временное уведомление
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <span>❌ ${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        document.body.appendChild(errorDiv);

        // Автоматически удаляем через 5 секунд
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    },

    // Показываем загрузку
    showLoading() {
        const elements = this.getFormElements();
        elements.submitBtn.disabled = true;
        elements.submitBtn.textContent = 'Загрузка...';
    },

    // Убираем состояние загрузки
    hideLoading() {
        const elements = this.getFormElements();
        elements.submitBtn.disabled = false;
        elements.submitBtn.textContent = 'Показать погоду';
    },

    // Создаём виджет погоды
    createWidget(weatherData, coords) {
        const widgetId = `widget-${Date.now()}`;
        const iconUrl = `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`;
        
        const widgetHTML = `
            <div class="weather-card" id="${widgetId}">
                <button class="remove-widget" onclick="UI.removeWidget('${widgetId}')">×</button>
                <h2>${weatherData.cityName}, ${weatherData.country}</h2>
                <p style="font-size: 14px; color: #999;">Координаты: ${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}</p>
                <img src="${iconUrl}" alt="${weatherData.description}" class="weather-icon">
                <div class="temperature">${weatherData.temperature}°</div>
                <div class="description">${weatherData.description}</div>
                <div class="weather-details">
                    <p>Ощущается как: ${weatherData.feelsLike}°</p>
                    <p>Влажность: ${weatherData.humidity}%</p>
                    <p>Ветер: ${weatherData.windSpeed} м/с</p>
                    <p>Давление: ${weatherData.pressure} гПа</p>
                </div>
                
                <!-- Карта -->
                ${MapManager.getMapHTML(widgetId)}
            </div>
        `;

        const elements = this.getFormElements();
        elements.widgetsContainer.insertAdjacentHTML('afterbegin', widgetHTML);
        
        // Сохраняем виджет
        this.widgets.push({ id: widgetId, coords, weatherData });

        // Создаём карту
        MapManager.createMap(
            widgetId, 
            coords.lat, 
            coords.lon, 
            weatherData.cityName
        );
    },

    // Удаляем виджет
    removeWidget(widgetId) {
        const widget = document.getElementById(widgetId);
        if (widget) {
            // Удаляем карту
            MapManager.removeMap(widgetId);
            
            // Удаляем виджет из DOM
            widget.remove();
            
            // Удаляем из массива
            this.widgets = this.widgets.filter(w => w.id !== widgetId);
        }
    },

    // Получаем значения из полей ввода
    getInputValues() {
        const elements = this.getFormElements();
        
        if (this.currentMode === 'coords') {
            return {
                mode: 'coords',
                latitude: elements.latInput.value.trim(),
                longitude: elements.lonInput.value.trim()
            };
        } else {
            return {
                mode: 'city',
                cityName: elements.cityInput.value.trim()
            };
        }
    },

    // Очищаем поля ввода
    clearInputs() {
        const elements = this.getFormElements();
        
        if (this.currentMode === 'coords') {
            elements.latInput.value = '';
            elements.lonInput.value = '';
        } else {
            elements.cityInput.value = '';
        }
    }
};