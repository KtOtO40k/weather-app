// Главный модуль приложения
const App = {
    // Инициализация приложения
    init() {
        this.attachEventListeners();
    },

    // Прикрепляем обработчики событий
    attachEventListeners() {
        const elements = UI.getFormElements();
        
        // Клик по кнопке
        elements.submitBtn.addEventListener('click', () => {
            this.handleWeatherRequest();
        });

        // Enter в полях ввода
        elements.latInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });

        elements.lonInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleWeatherRequest();
        });
    },

    // Обработка запроса погоды
    async handleWeatherRequest() {
        // Получаем значения из полей
        const { latitude, longitude } = UI.getInputValues();

        // Валидируем
        const validation = Validator.validateCoordinates(latitude, longitude);
        
        if (!validation.valid) {
            UI.showError(validation.message);
            return;
        }

        // Показываем загрузку
        UI.showLoading();

        try {
            // Получаем погоду
            const weatherData = await WeatherAPI.getWeatherByCoords(
                validation.latitude, 
                validation.longitude
            );

            // Создаём виджет
            UI.createWidget(weatherData, {
                lat: validation.latitude,
                lon: validation.longitude
            });

            // Очищаем поля ввода
            UI.clearInputs();
            
        } catch (error) {
            UI.showError(error.message);
        } finally {
            // Убираем загрузку
            UI.hideLoading();
        }
    }
};

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});