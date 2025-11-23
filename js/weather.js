
const WeatherAPI = {
    apiKey: 'def8c396f263a05f9ac50851ff2b88fd',
    baseUrl: 'https://api.openweathermap.org/data/2.5/weather',
    cache: {}, 
    cacheDuration: 10 * 60 * 1000, 

    
    getCacheKey(lat, lon) {
        return `${lat.toFixed(2)}_${lon.toFixed(2)}`;
    },

    
    getFromCache(lat, lon) {
        const key = this.getCacheKey(lat, lon);
        const cached = this.cache[key];
        
        if (cached && (Date.now() - cached.timestamp < this.cacheDuration)) {
            
            return cached.data;
        }
        
        return null;
    },

    
    saveToCache(lat, lon, data) {
        const key = this.getCacheKey(lat, lon);
        this.cache[key] = {
            data: data,
            timestamp: Date.now()
        };
    },

    
    async getWeatherByCoords(lat, lon) {
        
        const cachedData = this.getFromCache(lat, lon);
        if (cachedData) {
            return cachedData;
        }

        try {
            
            const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ru`;
            
            
            
            
            const response = await fetch(url);
            
            
            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Превышен лимит запросов. Подождите минуту и попробуйте снова.');
                }
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
           
            const data = await response.json();
            
            
            const formattedData = this.formatWeatherData(data);
            
            
            this.saveToCache(lat, lon, formattedData);
            
            return formattedData;
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            throw error;
        }
    },

    
    async getWeatherByCity(cityName) {
        try {
            
            const url = `${this.baseUrl}?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric&lang=ru`;
            
            
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Город не найден. Проверьте название или попробуйте указать страну (например: "Warsaw, PL")');
                }
                if (response.status === 429) {
                    throw new Error('Превышен лимит запросов. Подождите минуту и попробуйте снова.');
                }
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            

            const data = await response.json();
            

            const formattedData = this.formatWeatherData(data);
            

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