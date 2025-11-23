// Главный модуль приложения
const App = {
    isLoading: false, // Флаг загрузки

    // Инициализация приложения
    init() {
        UI.initModeToggle(); // Инициализируем переключатель режимов
        this.attachEventListeners();
    },

    // Прикрепляем обработчики событий
    attachEventListeners() {
        const elements = UI.getFormElements();
        
        // Клик по кнопке
        elements.submitBtn.addEventListener('click', () => {
            this.handleWeatherRequest();
        });

        // Enter в полях координат
        elements.latInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });

        elements.lonInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });

        // Enter в поле города
        elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });
    },

    // Обработка запроса погоды
    async handleWeatherRequest() {
        // Если уже идёт загрузка - выходим
        if (this.isLoading) {
            console.log('Запрос уже выполняется');
            return;
        }

        // Получаем значения из полей
        const inputData = UI.getInputValues();

        let weatherData;
        let coords;

        // Устанавливаем флаг загрузки
        this.isLoading = true;
        
        // Показываем загрузку
        UI.showLoading();

        try {
            // Обрабатываем в зависимости от режима
            if (inputData.mode === 'coords') {
                // Режим координат
                const validation = Validator.validateCoordinates(inputData.latitude, inputData.longitude);
                
                if (!validation.valid) {
                    UI.showError(validation.message);
                    return;
                }

                // Получаем погоду по координатам
                weatherData = await WeatherAPI.getWeatherByCoords(
                    validation.latitude, 
                    validation.longitude
                );

                coords = {
                    lat: validation.latitude,
                    lon: validation.longitude
                };

            } else {
                // Режим поиска по городу
                const validation = Validator.validateCityName(inputData.cityName);
                
                if (!validation.valid) {
                    UI.showError(validation.message);
                    return;
                }

                // Получаем погоду по названию города
                weatherData = await WeatherAPI.getWeatherByCity(validation.cityName);

                // Координаты приходят из API
                coords = weatherData.coordinates;
            }

            // Создаём виджет
            UI.createWidget(weatherData, coords);

            // Очищаем поля ввода
            UI.clearInputs();
            
        } catch (error) {
            UI.showError(error.message);
        } finally {
            // Убираем загрузку и снимаем флаг
            UI.hideLoading();
            this.isLoading = false;
        }
    }
};

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});