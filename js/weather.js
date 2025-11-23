// Объект для работы с погодным API
const WeatherAPI = {
    apiKey: 'def8c396f263a05f9ac50851ff2b88fd',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    cache: {}, // Кэш для хранения результатов
    cacheDuration: 10 * 60 * 1000, // 10 минут в миллисекундах

    // Генерируем ключ кэша
    getCacheKey(lat, lon) {
        return `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    },

    // Проверяем кэш
    getFromCache(lat, lon) {
        const key = this.getCacheKey(lat, lon);
        const cached = this.cache[key];
        
        if (cached && (Date.now() - cached.timestamp < this.cacheDuration)) {
            console.log('Данные взяты из кэша');
            return cached.data;
        }
        
        return null;
    },

    // Сохраняем в кэш
    saveToCache(lat, lon, data) {
        const key = this.getCacheKey(lat, lon);
        this.cache[key] = {
            data: data,
            timestamp: Date.now()
        };
    },

    // Получаем погоду по координатам
    async getWeatherByCoords(lat, lon) {
        // Проверяем кэш
        const cachedData = this.getFromCache(lat, lon);
        if (cachedData) {
            return cachedData;
        }

        try {
            // Формируем URL с параметрами
            const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ru`;
            
            console.log('Делаем запрос к API...');
            
            // Делаем запрос
            const response = await fetch(url);
            
            // Проверяем успешность запроса
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Превышен лимит запросов. Подождите минуту и попробуйте снова.');
                }
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            // Парсим JSON
            const data = await response.json();
            
            // Форматируем данные
            const formattedData = this.formatWeatherData(data);
            
            // Сохраняем в кэш
            this.saveToCache(lat, lon, formattedData);
            
            return formattedData;
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            throw error;
        }
    },

    // Получаем погоду по названию города
    async getWeatherByCity(cityName) {
        try {
            // Формируем URL для поиска по городу
            const url = `${this.baseUrl}?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric&lang=ru`;
            
            console.log('Поиск города:', cityName);
            
            // Делаем запрос
            const response = await fetch(url);
            
            // Проверяем успешность запроса
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Город не найден. Проверьте название или попробуйте указать страну (например: "Warsaw, PL")');
                }
                if (response.status === 429) {
                    throw new Error('Превышен лимит запросов. Подождите минуту и попробуйте снова.');
                }
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            // Парсим JSON
            const data = await response.json();
            
            // Форматируем данные
            const formattedData = this.formatWeatherData(data);
            
            // Добавляем координаты в результат
            formattedData.coordinates = {
                lat: data.coord.lat,
                lon: data.coord.lon
            };
            
            return formattedData;
            
        } catch (error) {
            console.error('Ошибка поиска города:', error);
            throw error;
        }
    },

    // Форматируем данные для удобного использования
    formatWeatherData(data) {
        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure,
            cityName: data.name,
            country: data.sys.country
        };
    }
};