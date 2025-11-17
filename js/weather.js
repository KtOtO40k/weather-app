// Объект для работы с погодным API
const WeatherAPI = {
    apiKey: 'bd5e378503939ddaee76f12ad7a97608',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',

    // Получаем погоду по координатам
    async getWeatherByCoords(lat, lon) {
        try {
            // Формируем URL с параметрами
            const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ru`;
            
            // Делаем запрос
            const response = await fetch(url);
            
            // Проверяем успешность запроса
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            // Парсим JSON
            const data = await response.json();
            
            // Возвращаем обработанные данные
            return this.formatWeatherData(data);
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            throw new Error('Не удалось получить данные о погоде');
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